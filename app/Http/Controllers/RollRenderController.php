<?php

namespace App\Http\Controllers;

use App\Models\ContextualizedRoll;

class RollRenderController extends Controller
{
    public function showL5RAEGRoll(int $id): string
    {
        $roll = ContextualizedRoll::where('type', 'AEG-L5R')->findOrFail($id);

        $r = $roll->getRoll();
        $description = "{$roll->campaign} | {$roll->character} | ";
        $description .= "{$r->parameters->roll}k{$r->parameters->keep} => {$r->result()['total']}";
        if ($r->parameters->tn) {
            $description .= ' '."(TN: {$r->parameters->tn})";
        }

        $metadata = [
            'og:title' => "Sakkaku – Roll for {$roll->campaign}",
            'og:type' => 'website',
            'og:image' => 'https://sakkaku.org/logo.png',
            'og:description' => $description,
        ];

        return $this->renderSPAWithMetadata($metadata);
    }

    private function renderSPAWithMetadata(array $metadata = []): string
    {
        // FIXME Abonimation with likely twelve critical security issues
        $metadataString = '';
        foreach ($metadata as $key => $value) {
            $key = htmlspecialchars($key);
            $value = htmlspecialchars($value);
            $metadataString .= "<meta property=\"{$key}\" content=\"{$value}\" />";
        }

        $rawHtml = file_get_contents(public_path().'/react/index.html');

        [$head, $body] = explode('</head>', $rawHtml);

        return $head.$metadataString.'</head>'.$body;
    }
}
