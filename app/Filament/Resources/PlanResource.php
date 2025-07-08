<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlanResource\Pages;
use App\Models\Plan;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PlanResource extends Resource
{
    protected static ?string $model = Plan::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()
                    ->schema([
                        TextInput::make('chargebee_id')
                            ->label('Chargebee Id')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('display_name')
                            ->label('Display Name')
                            ->required()
                            ->rules(['required', 'string', 'max:255']),
                        RichEditor::make('description')
                            ->rules(['nullable', 'min:10'])
                            ->columnSpanFull(),
                        TextInput::make('price')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('chargebee_product')
                            ->label('Chargebee Product')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('frequency')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('currency')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('quantity')
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('cta')
                            ->rules(['nullable', 'string', 'max:255']),
                        Checkbox::make('popular')
                            ->default(false)
                            ->rules(['boolean']),
                    ])->columns(2),

                Section::make('Plan Detauls')
                    ->schema([
                        Repeater::make('details')
                            ->label('Details')
                            ->schema([
                                TextInput::make('value')->label('Detail')
                            ])
                            ->defaultItems(0)
                            ->columnSpanFull()
                            ->mutateDehydratedStateUsing(function (array $state) {
                                return array_column($state, 'value');
                            })
                            ->afterStateHydrated(function ($component, $state) {
                                $component->state(
                                    collect($state)->map(fn($item) => ['value' => $item])->toArray()
                                );
                            }),
                    ]),

                Section::make('Plan Limitations')
                    ->schema([
                        Repeater::make('limitations')
                            ->label('Limitations')
                            ->schema([
                                TextInput::make('value')->label('Limitation')
                            ])
                            ->defaultItems(0)
                            ->columnSpanFull()
                            ->mutateDehydratedStateUsing(function (array $state) {
                                return array_column($state, 'value');
                            })
                            ->afterStateHydrated(function ($component, $state) {
                                $component->state(
                                    collect($state)->map(fn($item) => ['value' => $item])->toArray()
                                );
                            })
                    ]),
                Section::make('Plan Features')
                    ->schema([
                        Repeater::make('features')
                            ->label('Features')
                            ->schema([
                                TextInput::make('key')->label('Feature Key'),
                                TextInput::make('value')->label('Feature Value'),
                            ])
                            ->defaultItems(0)
                            ->columnSpanFull()
                            ->columns(2)
                            ->mutateDehydratedStateUsing(function (array $state) {
                                return collect($state)
                                    ->mapWithKeys(function ($item) {
                                        $value = $item['value'];
                                        if (is_numeric($value)) {
                                            $value = (int)$value;
                                        } elseif (in_array(strtolower($value), ['true', 'false'])) {
                                            $value = strtolower($value) === 'true';
                                        }

                                        return [$item['key'] => $value];
                                    })->toArray();
                            })
                            ->afterStateHydrated(function ($component, $state) {
                                $component->state(
                                    collect($state)->map(function ($value, $key) {
                                        if (is_bool($value)) {
                                            $value = $value ? 'true' : 'false';
                                        }
                                        return ['key' => $key, 'value' => (string)$value];
                                    })->values()->toArray()
                                );
                            }),

                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('chargebee_id')
                    ->label('Chargebee Id')
                    ->toggleable(),
                TextColumn::make('display_name')
                    ->label('Display Name')
                    ->toggleable(),
                TextColumn::make('description')
                    ->getStateUsing(fn($record) => $record->description ?? 'N/A')
                    ->toggleable(),
                TextColumn::make('price')
                    ->toggleable(),
                TextColumn::make('currency')
                    ->toggleable(),
                TextColumn::make('frequency')
                    ->toggleable(),
                TextColumn::make('chargebee_product')
                    ->label('Chargebee Product')
                    ->toggleable(),
                TextColumn::make('quantity')
                    ->toggleable(),
                TextColumn::make('details')
                    ->getStateUsing(fn($record) => $record->details ?? 'N/A')
                    ->toggleable(),
                TextColumn::make('limitations')
                    ->getStateUsing(fn($record) => $record->limitations ?? 'N/A')
                    ->toggleable(),
                TextColumn::make('cta')
                    ->getStateUsing(fn($record) => $record->cta ?? 'N/A')
                    ->toggleable(),
                TextColumn::make('popular')


            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPlans::route('/'),
            'edit' => Pages\EditPlan::route('/{record}/edit'),
        ];
    }
}
