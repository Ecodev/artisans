<?php

declare(strict_types=1);

namespace Application\Handler;

use Application\Repository\NewsRepository;
use Application\Repository\ProductRepository;
use DOMDocument;
use DOMNode;
use Laminas\Diactoros\Response\XmlResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class SitemapHandler implements \Psr\Http\Server\RequestHandlerInterface
{
    public function __construct(private readonly ProductRepository $productRepository, private readonly NewsRepository $newsRepository, private readonly string $baseUrl, private readonly array $sitemapStaticUrls)
    {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $sitemap = $this->getSitemap();
        $response = new XmlResponse($sitemap);

        return $response;
    }

    private function getSitemap(): string
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $document->formatOutput = true;
        $urlset = $document->createElement('urlset');
        $document->appendChild($urlset);
        $urlset->setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        $this->addUrl($document, $urlset, '/');

        foreach ($this->sitemapStaticUrls as $url) {
            $this->addUrl($document, $urlset, $url);
        }

        $products = $this->productRepository->getIds();
        foreach ($products as $product) {
            if ($product['reviewNumber']) {
                $this->addUrl($document, $urlset, '/larevuedurable/numero/' . $product['id']);
            } else {
                $this->addUrl($document, $urlset, '/larevuedurable/article/' . $product['id']);
            }
        }

        $news = $this->newsRepository->getIds();
        foreach ($news as $new) {
            $this->addUrl($document, $urlset, '/actualite/' . $new['id']);
        }

        $result = $document->saveXml();

        return $result;
    }

    private function addUrl(DOMDocument $document, DOMNode $urlset, string $urlValue): void
    {
        $url = $document->createElement('url');
        $urlset->appendChild($url);
        $loc = $document->createElement('loc', $this->baseUrl . htmlspecialchars($urlValue));
        $url->appendChild($loc);
    }
}
