<?php

declare(strict_types=1);

namespace ApplicationTest\Action;

use Application\Action\ExportTransactionLinesAction;
use Application\Model\TransactionLine;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\ServerRequest;

class ExcelExportActionTest extends TestCase
{
    use TestWithTransaction;

    public function testExportTransactionLines(): void
    {
        // Query to generate the Excel file on disk
        $hostname = 'chez-emmy.lan';
        $qb = _em()->getRepository(TransactionLine::class)->createQueryBuilder('tl');
        $action = new ExportTransactionLinesAction($hostname);
        $url = $action->generate($qb->getQuery());

        $baseUrl = 'https://' . $hostname . '/export/transactionLines/';

        $this->assertStringStartsWith($baseUrl, $url);

        preg_match('#' . $baseUrl . '([0-9a-f]+)/(.+)#', $url, $m);

        // Make sure the XLSX file was generated on disk
        $fpath = 'data/tmp/excel/' . $m[1];
        $this->assertFileExists($fpath);
        $size = filesize($fpath);

        // Test middleware action to download the Excel file
        $action = new ExportTransactionLinesAction($hostname);
        // Mock route parsing: /export/transactionLines/{key:[0-9a-f]+}/{name:.+\.xlsx}
        $request = (new ServerRequest())->withAttribute('key', $m[1])->withAttribute('name', $m[2]);

        $handler = $this->prophesize(RequestHandlerInterface::class);

        $response = $action->process($request, $handler->reveal());

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('attachment; filename=ChezEmmy_compta_ecritures', $response->getHeaderLine('content-disposition'));
        $this->assertEquals($size, $response->getHeaderLine('content-length'));
    }
}
