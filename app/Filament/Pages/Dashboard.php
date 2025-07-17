<?php

namespace App\Filament\Pages;

use App\Enums\Period;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;

class Dashboard extends \Filament\Pages\Dashboard
{
    use HasFiltersForm;

    public function filtersForm(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('period')
                    ->label('Select Period')
                    ->default(Period::LAST_30_DAYS->value)
                    ->options(Period::class)
            ]);
    }
}
