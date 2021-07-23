<?php

namespace Tests\Unit\Concepts\FFG\L5R;

use App\Concepts\FFG\L5R\Roll;
use Assert\InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 * @coversNothing
 */
class RollTest extends TestCase
{
    public function testCanCreateFromArray()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 2, 'skill' => 1],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'kept',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'dropped',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'kept',
                    'value' => ['oppportunity' => 1],
                ],
            ],
        ]);
        $this->assertEquals(2, $roll->parameters->tn);
        $this->assertCount(3, $roll->dices);
        $this->assertEquals('skill', $roll->dices[2]->type);
    }

    public function testCanInitFromJustParameters()
    {
        $roll = Roll::init(['tn' => 3, 'ring' => 3, 'skill' => 3]);
        $this->assertCount(6, $roll->dices);
    }

    public function testCanSetMetadata()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 0],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
            'metadata' => ['about' => 'Test roll'],
        ]);
        $this->assertEquals('Test roll', $roll->metadata['about']);
    }

    public function testCanKeepDices()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->keep([0]);
        $this->assertCount(1, $roll->dices);
        $this->assertEquals('kept', $roll->dices[0]->status);
        $this->assertEquals(
            ['opportunity' => 0, 'strife' => 0, 'success' => 0],
            $roll->result()
        );
    }

    public function testCannotKeepZeroDice()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->keep([]);
    }

    public function testCannotKeepZeroDiceEvenIfCompromised()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['compromised']],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->keep([]);
    }

    public function testCanKeepZeroDiceIfCompromisedAndNoOption()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['compromised']],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => ['strife' => 1, 'success' => 1]]],
        ]);
        $roll->keep([]);
        $this->assertEquals('dropped', $roll->dices[0]->status);
        $this->assertEquals(
            ['opportunity' => 0, 'strife' => 0, 'success' => 0],
            $roll->result()
        );
    }

    public function testCannotKeepDicesWithStrifeIfCompromised()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['compromised']],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => ['strife' => 1, 'success' => 1]]],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->keep([0]);
    }

    public function testCannotKeepIfRerollsArePending()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->keep([0]);
    }

    public function testCanKeepIfRerollsAreDone()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
            'metadata' => ['rerolls' => ['adversity']],
        ]);
        $roll->keep([0]);
        $this->assertEquals(
            ['opportunity' => 0, 'strife' => 0, 'success' => 0],
            $roll->result()
        );
    }

    public function testCanExplode()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 2, 'skill' => 1],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['opportunity' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'explosion' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['opportunity' => 1, 'success' => 1],
                ],
            ],
        ]);
        $roll->keep([1, 2]);
        $this->assertCount(4, $roll->dices);
        $this->assertTrue($roll->dices[0]->isDropped());
        $this->assertTrue($roll->dices[3]->isPending());
        $this->assertEquals(['source' => 'explosion'], $roll->dices[3]->metadata);
        $this->assertEquals('ring', $roll->dices[3]->type);
        $this->assertEquals(
            ['opportunity' => 1, 'strife' => 1, 'success' => 2],
            $roll->result()
        );
    }

    public function testCanKeepZeroDiceIfSomeDicesAreAlreadyKept()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 0],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'kept',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['opportunity' => 1, 'strife' => 1],
                ],
            ],
        ]);
        $roll->keep([]);
        $this->assertEquals(
            ['opportunity' => 0, 'strife' => 1, 'success' => 1],
            $roll->result()
        );
    }

    public function testCanReroll()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => ['distinction']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([1], 'distinction');
        $this->assertCount(3, $roll->dices);
        $this->assertEquals('rerolled', $roll->dices[1]->status);
        $this->assertEquals(['end' => 'distinction'], $roll->dices[1]->metadata);
        $this->assertEquals('skill', $roll->dices[2]->type);
        $this->assertEquals(['source' => 'distinction'], $roll->dices[2]->metadata);
        $this->assertEquals(['rerolls' => ['distinction']], $roll->metadata);
    }

    public function testCannotReReroll()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['distinction']],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
            'metadata' => ['rerolls' => ['distinction']],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0], 'distinction');
    }

    public function testCannotRerollIfNotAllowedInParameters()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => []]],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0], 'distinction');
    }

    public function testMustRerollBestDicesIfAdversity()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0], 'adversity');
    }

    public function testMustRerollUpToTwoDicesIfAdversity()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([], 'adversity');
    }

    public function testCanRerollLessThanTwoDicesIfAdversityAndNotEnoughTargets()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['adversity']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
            ],
        ]);
        $roll->reroll([1], 'adversity');
        $this->assertCount(3, $roll->dices);
        $this->assertEquals('rerolled', $roll->dices[1]->status);
        $this->assertEquals(['rerolls' => ['adversity']], $roll->metadata);
    }

    public function testCanRerollNoDiceWithDistinction()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 0, 'modifiers' => ['distinction']],
            'dices' => [['type' => 'ring', 'status' => 'pending', 'value' => ['success' => 1]]],
        ]);
        $roll->reroll([], 'distinction');
        $this->assertCount(1, $roll->dices);
        $this->assertEquals('pending', $roll->dices[0]->status);
        $this->assertEquals(['rerolls' => ['distinction']], $roll->metadata);
    }

    public function testCannotRerollMoreThanTwoDicesAsADefault()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => ['distinction']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0, 1, 2], 'distinction');
    }

    public function testCanRerollMoreThanTwoDicesWithStirringTheEmbers()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'distinction',
                'stirring',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0, 1, 2], 'distinction');
        $this->assertCount(6, $roll->dices);
    }

    public function testCanRerollWithVictoryBeforeHonor()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => ['shadow']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([1], 'shadow');
        $this->assertCount(3, $roll->dices);
    }

    public function testMustRerollAdversityBeforeVictoryBeforeHonor()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => ['adversity', 'shadow']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([1], 'shadow');
    }

    public function testCanRerollWithDisadvantageThenTechnique()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => ['adversity', 'shadow']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0], 'adversity');
        $roll->reroll([1, 2], 'shadow');
        $this->assertCount(5, $roll->dices);
        $this->assertEquals(['rerolls' => ['adversity', 'shadow']], $roll->metadata);
        $this->assertEquals('rerolled', $roll->dices[0]->status);
        $this->assertEquals(['end' => 'adversity'], $roll->dices[0]->metadata);
        $this->assertEquals('rerolled', $roll->dices[1]->status);
        $this->assertEquals(['end' => 'shadow'], $roll->dices[1]->metadata);
        $this->assertEquals('rerolled', $roll->dices[2]->status);
        $this->assertEquals(['source' => 'adversity', 'end' => 'shadow'], $roll->dices[2]->metadata);
        $this->assertEquals('pending', $roll->dices[4]->status);
        $this->assertEquals(['source' => 'shadow'], $roll->dices[4]->metadata);
    }

    public function testCanRerollMoreThanTwoDicesWithDeathdealer()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'distinction',
                'deathdealer',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0, 1, 2], 'distinction');
        $this->assertCount(6, $roll->dices);
        $this->assertEquals(['rerolls' => ['distinction', 'deathdealer']], $roll->metadata);
    }

    public function testCanAlsoRerollDeathdealerWithoutDistinction()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'deathdealer',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0, 2], 'deathdealer');
        $this->assertCount(5, $roll->dices);
        $this->assertEquals(['rerolls' => ['deathdealer']], $roll->metadata);
    }

    public function testManipulatorWorksTheSameAsDeathdealerWithDistinction()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'distinction',
                'manipulator',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0, 1, 2], 'distinction');
        $this->assertCount(6, $roll->dices);
        $this->assertEquals(['rerolls' => ['distinction', 'manipulator']], $roll->metadata);
    }

    public function testManipulatorWorksByItselfFineToo()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'manipulator',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0, 2], 'manipulator');
        $this->assertCount(5, $roll->dices);
        $this->assertEquals(['rerolls' => ['manipulator']], $roll->metadata);
    }

    public function testMirumotoWardingIsAnotherWayToGetAReroll()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                '2heavens',
                'shadow',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $roll->reroll([0], '2heavens');
        $this->assertCount(4, $roll->dices);
        $this->assertEquals(['rerolls' => ['2heavens']], $roll->metadata);
    }

    public function testCanWardAnyNumberOfDices()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                '2heavens',
                'shadow',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $roll->reroll([0, 2], '2heavens');
        $this->assertCount(5, $roll->dices);
        $this->assertEquals(['rerolls' => ['2heavens']], $roll->metadata);
    }

    public function testCanOnlyRerollSuccessWithMirumotoWarding()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                '2heavens',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([1], '2heavens');
    }

    public function testMustRerollDistinctionBeforeWarding()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'distinction',
                '2heavens',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0], '2heavens');
    }

    public function testMustRerollWardingBeforeSchool()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'shadow',
                '2heavens',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0], 'shadow');
    }

    public function testWardingActuallyHappensAfterDeathdealer()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                '2heavens',
                'deathdealer',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'opportunity' => 1],
                ],
            ],
        ]);
        $roll->reroll([1], 'deathdealer');
        $this->assertEquals(['rerolls' => ['deathdealer']], $roll->metadata);
        $roll->reroll([0], '2heavens');
        $this->assertEquals(['rerolls' => ['deathdealer', '2heavens']], $roll->metadata);

        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                '2heavens',
                'deathdealer',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'opportunity' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0], '2heavens');
    }

    public function testCanManuallyRerollEverything()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'ruleless',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'opportunity' => 1],
                ],
            ],
        ]);
        $roll->reroll([0, 1, 2], 'ruleless');
        $this->assertEquals(['rerolls' => ['ruleless']], $roll->metadata);
    }

    public function testRuthlessIsJustAnotherSpecialReroll()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'ruthless',
                'shadow',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $roll->reroll([1], 'ruthless');
        $this->assertCount(4, $roll->dices);
        $this->assertEquals(['rerolls' => ['ruthless']], $roll->metadata);
    }

    public function testCannotKeepMoreDicesThanRing()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 1, 'ring' => 1, 'skill' => 1],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->keep([0, 1]);
    }

    public function testRollOneMoreDiceWithVoid()
    {
        $roll = Roll::init([
            'tn' => 3,
            'ring' => 2,
            'skill' => 1,
            'modifiers' => ['void'],
        ]);
        $this->assertCount(4, $roll->dices);
    }

    public function testCanKeepOneMoreDiceWithVoid()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'tn' => 2,
                'ring' => 1,
                'skill' => 1,
                'modifiers' => ['void'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->assertFalse($roll->isComplete());
        $roll->keep([0, 2]);
        $this->assertTrue($roll->isComplete());
    }

    public function testItConvertsToArrayNicely()
    {
        $rollAsArray = [
            'parameters' => [
                'tn' => 1,
                'ring' => 1,
                'skill' => 1,
                'modifiers' => [],
                'channeled' => [],
                'addkept' => [],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [
                        'opportunity' => 1,
                        'success' => 0,
                        'strife' => 0,
                        'explosion' => 0,
                    ],
                    'metadata' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [
                        'opportunity' => 0,
                        'success' => 1,
                        'strife' => 0,
                        'explosion' => 0,
                    ],
                    'metadata' => [],
                ],
            ],
            'metadata' => [],
        ];
        $roll = Roll::fromArray($rollAsArray);
        $this->assertEquals($rollAsArray, $roll->toArray());
    }

    public function testCanKeepExtraDicesFromExplosions()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'tn' => 2,
                'ring' => 1,
                'skill' => 1,
                'modifiers' => [],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'kept',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'dropped',
                    'value' => [],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->assertFalse($roll->isComplete());
        $roll->keep([2]);
        $this->assertTrue($roll->isComplete());
    }

    public function testCanBlankDicesWithAlteration()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'tn' => 2,
                'ring' => 2,
                'skill' => 1,
                'modifiers' => ['ishiken'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $roll->alter(
            [
                [
                    'position' => 0,
                    'value' => [],
                ],
                [
                    'position' => 2,
                    'value' => [],
                ],
            ],
            'ishiken'
        );
        $this->assertCount(5, $roll->dices);
        $this->assertEquals(['rerolls' => ['ishiken']], $roll->metadata);
        $this->assertEquals('rerolled', $roll->dices[0]->status);
        $this->assertEquals(['end' => 'ishiken'], $roll->dices[0]->metadata);
        $this->assertEquals('pending', $roll->dices[3]->status);
        $this->assertEquals(['source' => 'ishiken'], $roll->dices[3]->metadata);
        $value = $roll->dices[3]->value;
        $this->assertEquals(0, $value->opportunity);
        $this->assertEquals(0, $value->strife);
        $this->assertEquals(0, $value->success);
        $this->assertEquals(0, $value->explosion);
    }

    public function testAlterBlankDices()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'tn' => 2,
                'ring' => 2,
                'skill' => 1,
                'modifiers' => ['ishiken'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $roll->alter(
            [
                [
                    'position' => 1,
                    'value' => ['success' => 1],
                ],
            ],
            'ishiken'
        );
        $this->assertCount(4, $roll->dices);
        $this->assertEquals(['rerolls' => ['ishiken']], $roll->metadata);
        $this->assertEquals('rerolled', $roll->dices[1]->status);
        $this->assertEquals(['end' => 'ishiken'], $roll->dices[1]->metadata);
        $this->assertEquals('pending', $roll->dices[3]->status);
        $this->assertEquals(['source' => 'ishiken'], $roll->dices[3]->metadata);
        $value = $roll->dices[3]->value;
        $this->assertEquals(0, $value->opportunity);
        $this->assertEquals(0, $value->strife);
        $this->assertEquals(1, $value->success);
        $this->assertEquals(0, $value->explosion);
    }

    public function testCannotMixPullAndPushForIshiken()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'tn' => 2,
                'ring' => 2,
                'skill' => 1,
                'modifiers' => ['ishiken'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->alter(
            [
                [
                    'position' => 1,
                    'value' => ['success' => 1],
                ],
                [
                    'position' => 2,
                    'value' => [],
                ],
            ],
            'ishiken'
        );
    }

    public function testCanAlterNothing()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'tn' => 2,
                'ring' => 2,
                'skill' => 1,
                'modifiers' => ['ishiken'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $roll->alter([], 'ishiken');
        $this->assertCount(3, $roll->dices);
        $this->assertEquals(['rerolls' => ['ishiken']], $roll->metadata);
    }

    public function testCanHaveChanneledDiceFromArray()
    {
        $roll = Roll::init([
            'tn' => 3,
            'ring' => 3,
            'skill' => 3,
            'channeled' => [
                ['type' => 'ring', 'value' => ['success' => 1]],
                ['type' => 'skill', 'value' => ['explosion' => 1]],
                ['type' => 'skill', 'value' => ['success' => 1, 'opportunity' => 1]],
            ],
        ]);
        $this->assertCount(6, $roll->dices);
        $this->assertEquals(['source' => 'channeled'], $roll->dices[0]->metadata);
        $this->assertEquals(['success' => 1, 'explosion' => 0, 'strife' => 0, 'opportunity' => 0], (array) $roll->dices[0]->value);
        $this->assertEquals([], $roll->dices[1]->metadata);
        $this->assertEquals([], $roll->dices[2]->metadata);
        $this->assertEquals(['source' => 'channeled'], $roll->dices[3]->metadata);
        $this->assertEquals(['source' => 'channeled'], $roll->dices[4]->metadata);
        $this->assertEquals([], $roll->dices[5]->metadata);
    }

    public function testCannotHackChanneledDices()
    {
        $roll = Roll::init([
            'tn' => 3,
            'ring' => 3,
            'skill' => 3,
            'channeled' => [
                ['type' => 'ring', 'value' => ['success' => 1], 'metadata' => []],
            ],
        ]);
        $this->assertCount(6, $roll->dices);
        $this->assertEquals(['source' => 'channeled'], $roll->dices[0]->metadata);
    }

    public function testCanAddKeptDicesToCheck()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 1,
                'addkept' => [['type' => 'ring', 'value' => ['opportunity' => 1]]],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->keep([0]);
        $this->assertCount(3, $roll->dices);
        $this->assertTrue($roll->isComplete());
        $this->assertEquals(['opportunity' => 1, 'success' => 1, 'strife' => 1], $roll->result());
    }

    public function testExtraKeptDicesAreNotAddedOnExplosions()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 1,
                'addkept' => [['type' => 'ring', 'value' => ['opportunity' => 1]]],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'kept',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'dropped',
                    'value' => [],
                ],
                [
                    'type' => 'ring',
                    'status' => 'kept',
                    'value' => ['opportunity' => 1],
                    'metadata' => ['source' => 'kept'],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['opportunity' => 1],
                    'metadata' => ['source' => 'explosion'],
                ],
            ],
        ]);
        $this->assertFalse($roll->isComplete());
        $roll->keep([3]);
        $this->assertCount(4, $roll->dices);
        $this->assertTrue($roll->isComplete());
        $this->assertEquals(['opportunity' => 2, 'success' => 1, 'strife' => 1], $roll->result());
    }

    public function testCanAddAKeptExplodingDice()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 1,
                'addkept' => [['type' => 'skill', 'value' => ['explosion' => 1]]],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->assertFalse($roll->isComplete());
        $roll->keep([0]);
        $this->assertFalse($roll->isComplete());
        $this->assertCount(4, $roll->dices);
        $this->assertEquals(['source' => 'explosion'], $roll->dices[3]->metadata);
    }

    public function testManualRerollOnlyCaresAboutRerollModifiers()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 1,
                'modifiers' => ['stirring', 'ruleless'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([1], 'ruleless');
        $this->assertCount(3, $roll->dices);
    }

    public function testCanRerollWithSailorTechnique()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => ['sailor']],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([1], 'sailor');
        $this->assertCount(3, $roll->dices);
    }

    public function testCanRerollNothingWithSailorIfCompromised()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => [
                'sailor',
                'compromised',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([], 'sailor');
        $this->assertCount(2, $roll->dices);
    }

    public function testCannotRerollAnythingWithSailorIfCompromised()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 1, 'modifiers' => [
                'sailor',
                'compromised',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['strife' => 1, 'success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([1], 'sailor');
    }

    public function testCanManualRerollBeforeAlteration()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'ruleless',
                'ishiken',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1, 'opportunity' => 1],
                ],
            ],
        ]);
        $roll->reroll([0, 1, 2], 'ruleless');
        $this->assertEquals(['rerolls' => ['ruleless']], $roll->metadata);
    }

    public function testCannotRerollDeathdealerBeforeDistinction()
    {
        $roll = Roll::fromArray([
            'parameters' => ['tn' => 2, 'ring' => 1, 'skill' => 2, 'modifiers' => [
                'distinction',
                'deathdealer',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0, 2], 'deathdealer');
    }

    public function testCanDoWhateverWithManualAlteration()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'tn' => 2,
                'ring' => 2,
                'skill' => 1,
                'modifiers' => ['reasonless'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['explosion' => 1, 'strife' => 1],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $roll->alter(
            [
                [
                    'position' => 1,
                    'value' => ['success' => 1],
                ],
                [
                    'position' => 2,
                    'value' => [],
                ],
            ],
            'reasonless'
        );
        $this->assertEquals(['rerolls' => ['reasonless']], $roll->metadata);
        $this->assertCount(5, $roll->dices);
    }

    public function testCanUpdateAddedKeptDice()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->updateParameters([
            'addkept' => [['type' => 'skill', 'value' => ['success' => 1, 'opportunity' => 1]]],
        ]);
        $this->assertEquals(
            [['type' => 'skill', 'value' => ['success' => 1, 'opportunity' => 1]]],
            $roll->parameters->addkept
        );
    }

    public function testCannotUpdateAddedKeptDiceIfAtLeastOneDiceKeptAlready()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 1,
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'kept',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->updateParameters([
            'addkept' => [['type' => 'skill', 'value' => ['success' => 1, 'opportunity' => 1]]],
        ]);
    }

    public function testCannotUpdateAddedKeptDiceIfRollIsComplete()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['compromised'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'dropped',
                    'value' => ['strife' => 1, 'opportunity' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->updateParameters([
            'addkept' => [['type' => 'skill', 'value' => ['success' => 1, 'opportunity' => 1]]],
        ]);
    }

    public function testCanAddABaseRerollAfterCreation()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['void'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->updateParameters([
            'modifiers' => ['void', 'ruleless'],
        ]);
        $this->assertEquals(
            ['void', 'ruleless'],
            $roll->parameters->modifiers
        );
    }

    public function testCanRerollAfterAlterationIfAskedNicely()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['ruleless', 'reasonless'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->alter(
            [
                [
                    'position' => 0,
                    'value' => ['success' => 1],
                ],
            ],
            'reasonless'
        );
        $this->assertEquals(['rerolls' => ['reasonless']], $roll->metadata);
        $this->assertCount(2, $roll->dices);
        $roll->reroll([1], 'ruleless');
        $this->assertEquals(['rerolls' => ['reasonless', 'ruleless']], $roll->metadata);
        $this->assertCount(3, $roll->dices);
    }

    public function testSomeRerollStillNeedsToHappenBeforeAlteration()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['2heavens', 'reasonless'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->alter(
            [
                [
                    'position' => 0,
                    'value' => ['success' => 1],
                ],
            ],
            'reasonless'
        );
    }

    public function testCanRerollUpToOneHundredTimesIFWantTo()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['ruleless', 'ruleless00', 'ruleless99'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0], 'ruleless');
        $roll->reroll([1], 'ruleless00');
        $roll->reroll([2], 'ruleless99');
        $this->assertEquals(['rerolls' => ['ruleless', 'ruleless00', 'ruleless99']], $roll->metadata);
        $this->assertCount(4, $roll->dices);
    }

    public function testCanAddExtraRerollOnTheFlyIfWantTo()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['ruleless'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0], 'ruleless');
        $roll->updateParameters(['modifiers' => ['ruleless', 'ruleless00']]);
        $roll->reroll([1], 'ruleless00');
        $this->assertEquals(['rerolls' => ['ruleless', 'ruleless00']], $roll->metadata);
    }

    public function testCanAlsoAddAlterations()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['ruleless42'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0], 'ruleless42');
        $roll->updateParameters(['modifiers' => ['ruleless42', 'reasonless13']]);
        $roll->alter(
            [
                [
                    'position' => 1,
                    'value' => ['success' => 1],
                ],
            ],
            'reasonless13'
        );
        $this->assertEquals(['rerolls' => ['ruleless42', 'reasonless13']], $roll->metadata);
    }

    public function testCanRemoveRerollIfNotUsedYet()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['compromised', 'ruleless42', 'void'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['opportunity' => 1],
                ],
            ],
        ]);
        $roll->updateParameters(['modifiers' => ['compromised', 'void']]);
        $this->assertEquals(['compromised', 'void'], $roll->parameters->modifiers);
    }

    public function testCanRemoveARerollAfterItHasBeenUsed()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['compromised', 'ruleless42', 'void'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['opportunity' => 1],
                ],
            ],
            'metadata' => ['rerolls' => ['ruleless42']],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->updateParameters(['modifiers' => ['compromised', 'void']]);
    }

    public function testCanRemoveNonRerollModifier()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => ['compromised', 'ruleless42', 'void'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => ['opportunity' => 1],
                ],
            ],
            'metadata' => ['rerolls' => ['ruleless42']],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->updateParameters(['modifiers' => ['compromised', 'ruleless42']]);
    }

    public function testWanderingBladeHasAnExtraSkillDie()
    {
        $roll = Roll::init([
            'ring' => 2, 'skill' => 3, 'modifiers' => ['wandering'],
        ]);
        $this->assertCount(6, $roll->dices);
        $this->assertCount(
            2,
            array_filter(
                $roll->dices,
                function ($dice) {
                    return 'ring' === $dice->type;
                }
            )
        );
        $this->assertCount(
            4,
            array_filter(
                $roll->dices,
                function ($dice) {
                    return 'skill' === $dice->type;
                }
            )
        );
    }

    public function testWanderingBladeCanAlterTheirDiceToOpportunity()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 2,
                'modifiers' => ['wandering'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->alter(
            [
                [
                    'position' => 0,
                    'value' => ['opportunity' => 1],
                ],
                [
                    'position' => 2,
                    'value' => ['opportunity' => 1],
                ],
            ],
            'wandering'
        );
        $this->assertEquals(['rerolls' => ['wandering']], $roll->metadata);
        $this->assertCount(6, $roll->dices);
        $this->assertEquals(['source' => 'wandering'], $roll->dices[4]->metadata);
        $this->assertEquals(['opportunity' => 1, 'strife' => 0, 'explosion' => 0, 'success' => 0], (array) $roll->dices[4]->value);
    }

    public function testWanderingBladeCannotAlterTheirDiceToAnythingElse()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 2,
                'modifiers' => ['wandering'],
            ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->alter(
            [
                [
                    'position' => 0,
                    'value' => ['success' => 1],
                ],
                [
                    'position' => 2,
                    'value' => ['success' => 1],
                ],
            ],
            'wandering'
        );
    }

    public function testCanChannelDice()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ring' => 1, 'skill' => 1],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
            ],
        ]);
        $roll->channel([1]);
        $this->assertCount(2, $roll->dices);
        $this->assertEquals('dropped', $roll->dices[0]->status);
        $this->assertEquals('channeled', $roll->dices[1]->status);
        $this->assertTrue($roll->isComplete());
    }

    public function testCannotChannelIfAnyDieIsKept()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ring' => 1, 'skill' => 1],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'dropped',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'kept',
                    'value' => ['explosion' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->channel([2]);
    }

    public function testCanHaveARinglessRoll()
    {
        $roll = Roll::init(['ring' => 0, 'skill' => 2]);
        $this->assertCount(2, $roll->dices);
    }

    public function testCanChannelARinglessRoll()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ring' => 0, 'skill' => 2],
            'dices' => [
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
            ],
        ]);
        $roll->channel([1]);
        $this->assertCount(2, $roll->dices);
        $this->assertEquals('dropped', $roll->dices[0]->status);
        $this->assertEquals('channeled', $roll->dices[1]->status);
        $this->assertTrue($roll->isComplete());
    }

    public function testCannotKeepARinglessRoll()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ring' => 0, 'skill' => 2],
            'dices' => [
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->keep([1]);
    }

    public function testAssistDiceAreRolled()
    {
        $roll = Roll::init([
            'ring' => 3,
            'skill' => 2,
            'modifiers' => ['unskilledassist03', 'skilledassist01'],
        ]);
        $this->assertCount(9, $roll->dices);
        $this->assertCount(
            6,
            array_filter(
                $roll->dices,
                function ($dice) {
                    return 'ring' === $dice->type;
                }
            )
        );
        $this->assertCount(
            3,
            array_filter(
                $roll->dices,
                function ($dice) {
                    return 'skill' === $dice->type;
                }
            )
        );
    }

    public function testAssistDiceCanBeKept()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 1,
                'modifiers' => ['skilledassist02'],
            ],
            'dices' => [
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->keep([0, 1, 2]);
        $this->assertEquals('kept', $roll->dices[0]->status);
        $this->assertEquals('kept', $roll->dices[1]->status);
        $this->assertEquals('kept', $roll->dices[2]->status);
        $this->assertEquals('dropped', $roll->dices[3]->status);
    }

    public function testAssistDiceStillHaveLimits()
    {
        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 1,
                'modifiers' => ['skilledassist02'],
            ],
            'dices' => [
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['explosion' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->keep([0, 1, 2, 3]);
    }

    public function testCanOnlyRerollBlankWithOffering()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ring' => 1, 'skill' => 1, 'modifiers' => [
                'offering',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => ['success' => 1],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([1], 'offering');
    }

    public function testCanOnlyRerollUpToThreeDiceWithOffering()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ring' => 2, 'skill' => 2, 'modifiers' => [
                'offering',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
                [
                    'type' => 'skill',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $this->expectException(InvalidArgumentException::class);
        $roll->reroll([0, 1, 2, 3], 'offering');
    }

    public function testCanRerollOfferingBeforeOrAfterDistinction()
    {
        $roll = Roll::fromArray([
            'parameters' => ['ring' => 1, 'skill' => 0, 'modifiers' => [
                'distinction',
                'offering',
            ]],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
        ]);
        $roll->reroll([0], 'offering');
        $this->assertEquals(['rerolls' => ['offering']], $roll->metadata);

        $roll = Roll::fromArray([
            'parameters' => [
                'ring' => 1,
                'skill' => 0,
                'modifiers' => [
                    'distinction',
                    'offering',
                ], ],
            'dices' => [
                [
                    'type' => 'ring',
                    'status' => 'pending',
                    'value' => [],
                ],
            ],
            'metadata' => [
                'rerolls' => ['distinction'],
            ],
        ]);
        $roll->reroll([0], 'offering');
        $this->assertEquals(['rerolls' => ['distinction', 'offering']], $roll->metadata);
    }
}
