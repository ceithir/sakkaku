<?php

namespace App\Http\Controllers;

use App\Models\ContextualizedRoll;

class RollRenderController extends Controller
{
    public function show(int $id): string
    {
        // TODO: Extend as more types become supported
        $roll = ContextualizedRoll::whereIn('type', ['DnD', 'AEG-L5R'])->findOrFail($id);

        switch ($roll->type) {
            case 'DnD':
                return $this->showStandardRoll($roll);

            case 'AEG-L5R':
                return $this->showL5RAEGRoll($roll);
        }
    }

    private function showL5RAEGRoll(ContextualizedRoll $roll): string
    {
        $r = $roll->getRoll();
        $description = "{$r->parameters->roll}k{$r->parameters->keep} => {$r->result()['total']}";
        if ($r->parameters->tn) {
            $description .= ' '."(TN: {$r->parameters->tn})";
        }

        return $this->renderSPAWithMetadata($roll, $description);
    }

    private function showStandardRoll(ContextualizedRoll $roll): string
    {
        $r = $roll->getRoll();
        $description = "{$r->parameters->formula()} => {$r->result()['total']}";

        return $this->renderSPAWithMetadata($roll, $description);
    }

    private function renderSPAWithMetadata(ContextualizedRoll $roll, $description): string
    {
        $description = "{$roll->campaign} 🌸 {$roll->character} 🌸 ".$description;

        $metadata = [
            'og:title' => "Sakkaku – Roll for {$roll->campaign}",
            'og:type' => 'website',
            'og:image' => 'https://sakkaku.org/logo.png',
            'og:description' => $description,
        ];

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
