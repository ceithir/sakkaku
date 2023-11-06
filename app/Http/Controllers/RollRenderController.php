<?php

namespace App\Http\Controllers;

use App\Models\ContextualizedRoll;

class RollRenderController extends Controller
{
    public function show(int $id): string
    {
        // TODO: Extend as more types become supported
        $roll = ContextualizedRoll::whereIn('type', ['DnD', 'AEG-L5R', 'Cyberpunk-RED'])->findOrFail($id);

        $actualRoll = $roll->getRoll();
        $description = "{$roll->campaign} 🌸 {$roll->character} 🌸 ";
        $description .= "{$actualRoll->parameters->formula()} => {$actualRoll->result()['total']}";
        if ($actualRoll->parameters->tn) {
            $description .= " (TN: {$actualRoll->parameters->tn})";
        }

        $metadata = [
            'og:title' => "Sakkaku – Roll for {$roll->campaign}",
            'og:type' => 'website',
            'og:image' => 'https://sakkaku.org/logo.png',
            'og:description' => $description,
        ];

        return $this->renderSPAWithMetadata($metadata);
    }

    private function renderSPAWithMetadata(array $metadata): string
    {
        // FIXME
        // Should be fine in absolute: https://stackoverflow.com/questions/19584189/when-used-correctly-is-htmlspecialchars-sufficient-for-protection-against-all-x
        // But there's likely a way to do that that does not feel so much like it's about to explode
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
