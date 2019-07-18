<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\TransactionLine;
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportTransactionLinesAction extends AbstractExcel
{
    /**
     * @var DecimalMoneyFormatter
     */
    private $moneyFormatter;

    /**
     * ReportTransactionsAction constructor.
     *
     * @param string $hostname
     */
    public function __construct(string $hostname)
    {
        parent::__construct($hostname, 'transactionLines');

        $currencies = new ISOCurrencies();
        $this->moneyFormatter = new DecimalMoneyFormatter($currencies);

        $this->outputFileName = sprintf('ChezEmmy_compta_ecritures_%s.xlsx', date('Y-m-d-H:i:s'));

        $sheet = $this->workbook->getActiveSheet();
        $sheet->setTitle('Compta Écritures');
        $sheet->getDefaultRowDimension()->setRowHeight(20);
    }

    /**
     * The model class name
     *
     * @return string
     */
    protected function getModelClass(): string
    {
        return TransactionLine::class;
    }

    /**
     * @param Worksheet $sheet
     * @param TransactionLine[] $items
     */
    protected function writeData(Worksheet $sheet, array $items): void
    {
        $sheet->setShowGridlines(false);
        $initialColumn = $maxColumn = $this->column;
        $currentTransactionRowStart = null;
        $currentTransactionId = null;

        $mergeRowsFromColumns = [
            $initialColumn + 1, // Transaction.ID
            $initialColumn + 2, // Transaction.name
            $initialColumn + 3, // Transaction.remarks
            $initialColumn + 4, // Transaction.internalRemarks
        ];

        foreach ($items as $index => $line) {
            if (!$currentTransactionId) {
                $currentTransactionId = $line->getTransaction()->getId();
                $currentTransactionRowStart = $this->row;
            } elseif ($line->getTransaction()->getId() !== $currentTransactionId) {
                // Current line is the first of a new transaction
                // Merge cells that have the same value because from the same transaction
                foreach ($mergeRowsFromColumns as $column) {
                    $sheet->mergeCellsByColumnAndRow($column, $currentTransactionRowStart, $column, $this->row - 1);
                }
                $currentTransactionRowStart = $this->row;
                $currentTransactionId = $line->getTransaction()->getId();
            }

            // Date
            $this->write($sheet, $line->getTransactionDate()->format('d.m.Y'));

            // Transaction.ID
            $this->write($sheet, $line->getTransaction()->getId());
            $url = 'https://' . $this->hostname . '/admin/transaction/%u';
            $sheet->getCellByColumnAndRow($this->column - 1, $this->row)->getHyperlink()->setUrl(sprintf($url, $line->getTransaction()->getId()));
            // Transaction.name
            $this->write($sheet, $line->getTransaction()->getName());
            // Transaction.remarks
            $this->write($sheet, $line->getTransaction()->getRemarks());
            // Transaction.internalRemarks
            $this->write($sheet, $line->getTransaction()->getInternalRemarks());

            // TransactionLine.name
            $this->write($sheet, $line->getName());
            // TransactionLine.remarks
            $this->write($sheet, $line->getRemarks());
            // TransactionLine.transactionTag
            $transactionTag = $line->getTransactionTag();
            if ($transactionTag && !empty($transactionTag->getColor())) {
                $color = (new Color())->setRGB(trim($transactionTag->getColor(), '#'));
                $sheet->getStyleByColumnAndRow($this->column, $this->row)
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->setStartColor($color);
            }
            $this->write($sheet, $transactionTag ? $transactionTag->getName() : '');
            // Debit account
            $this->write($sheet, $line->getDebit() ? implode(' ', [$line->getDebit()->getCode(), $line->getDebit()->getName()]) : '');
            // Credit account
            $this->write($sheet, $line->getCredit() ? implode(' ', [$line->getCredit()->getCode(), $line->getCredit()->getName()]) : '');
            // Debit amount
            $this->write($sheet, $line->getDebit() ? $this->moneyFormatter->format($line->getBalance()) : '');
            // Credit amount
            $this->write($sheet, $line->getCredit() ? $this->moneyFormatter->format($line->getBalance()) : '');
            // Reconciled
            $sheet->getStyleByColumnAndRow($this->column, $this->row)->applyFromArray(self::$centerFormat);
            $this->write($sheet, $line->isReconciled() ? '✔️' : '');

            $maxColumn = $this->column - 1;

            $range = Coordinate::stringFromColumnIndex($initialColumn) . $this->row . ':' . Coordinate::stringFromColumnIndex($maxColumn) . $this->row;
            // Thicker horizontal delimiter between lines of different transactions
            if ($index === max(array_keys($items)) || $line->getTransaction()->getId() !== $items[$index + 1]->getTransaction()->getId()) {
                $borderBottom = self::$bordersBottom;
            } else {
                $borderBottom = self::$bordersBottomLight;
            }
            $sheet->getStyle($range)->applyFromArray($borderBottom);

            $this->column = $initialColumn;
            ++$this->row;
        }
    }

    protected function getHeaders(): array
    {
        return [
            ['label' => 'Date', 'width' => 12, 'formats' => [self::$dateFormat]],
            ['label' => 'ID', 'width' => 5, 'formats' => [self::$headerFormat, self::$centerFormat]],
            ['label' => 'Transaction', 'width' => 'auto', 'formats' => [self::$wrapFormat]],
            ['label' => 'Remarques', 'width' => 'auto', 'formats' => [self::$wrapFormat]],
            ['label' => 'Remarques internes', 'width' => 'auto', 'formats' => [self::$wrapFormat]],
            ['label' => 'Écriture', 'width' => 'auto', 'formats' => [self::$wrapFormat]],
            ['label' => 'Remarques', 'width' => 'auto', 'formats' => [self::$wrapFormat]],
            ['label' => 'Tags', 'width' => 'auto', 'formats' => [self::$wrapFormat]],
            ['label' => 'Compte débit', 'width' => 30, 'formats' => [self::$wrapFormat]],
            ['label' => 'Compte crédit', 'width' => 30, 'formats' => [self::$wrapFormat]],
            ['label' => 'Montant débit', 'width' => 20, 'formats' => [self::$headerFormat]],
            ['label' => 'Montant crédit', 'width' => 20, 'formats' => [self::$headerFormat]],
            ['label' => 'Pointé', 'width' => 12, 'formats' => [self::$centerFormat]],
        ];
    }

    /**
     * @param Worksheet $sheet
     * @param TransactionLine[] $items
     */
    protected function writeFooter(Worksheet $sheet, array $items): void
    {
        $initialColumn = $this->column;

        // Date
        $this->write($sheet, '');
        // ID
        $this->write($sheet, '');
        // Transaction.name
        $this->write($sheet, '');
        // Transaction.remarks
        $this->write($sheet, '');
        // Internal remarks
        $this->write($sheet, '');
        // TransactionLine.name
        $this->write($sheet, '');
        // Remarks
        $this->write($sheet, '');
        // TransactionLine.transactionTag
        $this->write($sheet, '');
        // Debit account
        $this->write($sheet, '');
        // Credit account
        $this->write($sheet, '');
        // Debit amount
        $this->write($sheet, '=SUBTOTAL(9,' . Coordinate::stringFromColumnIndex($this->column) . '2:' . Coordinate::stringFromColumnIndex($this->column) . ($this->row - 1) . ')');
        // Credit amount
        $this->write($sheet, '=SUBTOTAL(9,' . Coordinate::stringFromColumnIndex($this->column) . '2:' . Coordinate::stringFromColumnIndex($this->column) . ($this->row - 1) . ')');
        // Reconciled
        $this->write($sheet, '');

        // Apply style
        $range = Coordinate::stringFromColumnIndex($initialColumn) . $this->row . ':' . Coordinate::stringFromColumnIndex($this->column - 1) . $this->row;
        $sheet->getStyle($range)->applyFromArray(self::$totalFormat);
    }
}