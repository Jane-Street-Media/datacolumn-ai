<?php

namespace App\Filament\Resources;

use App\Enums\NotificationType;
use App\Filament\Resources\NotificationTemplateResource\Pages;
use App\Models\NotificationTemplate;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NotificationTemplateResource extends Resource
{
    protected static ?string $model = NotificationTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-c-bell';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()
                    ->schema([
                        TextInput::make('name')
                            ->label('Template Name')
                            ->placeholder('Enter Template Name')
                            ->required()
                            ->unique(ignoreRecord: true),
                        TextInput::make('subject')
                            ->label('Subject')
                            ->required()

                            ->maxValue(255)
                            ->placeholder('Email Subject'),
                        Select::make('type')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->options(NotificationType::class),
                        Textarea::make('message')
                            ->label('Text')
                            ->required()
                            ->placeholder('Enter Template message')
                            ->helperText(
                                'Applicable attributes are: [user_name], [team_name], [plan_name], [old_plan], [new_plan]'
                            )
                            ->columnSpanFull()
                            ->rows(10),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Template Name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('type')
                    ->label('Type')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('subject')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('message')
                    ->sortable()
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([

                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNotificationTemplates::route('/'),
//            'create' => Pages\CreateNotificationTemplate::route('create'),
            'edit' => Pages\EditNotificationTemplate::route('/{record}/edit'),
        ];
    }
}
