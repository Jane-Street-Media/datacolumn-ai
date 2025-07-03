<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeamResource\Pages;
use App\Models\Team;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TeamResource extends Resource
{
    protected static ?string $model = Team::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder';

    public static function getUsersByTeam($teamId): string
    {
        return UserResource::getUrl('index', [
            'tableFilters' => [
                'teams' => ['value' => $teamId]
            ]
        ]);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {

        return $table
            ->columns([
                TextColumn::make('name')
                    ->url(fn($record) => static::getUsersByTeam($record->id)),
                TextColumn::make('users_count')
                    ->label('No of Users')
                    ->counts('users')
                    ->url(fn($record) => static::getUsersByTeam($record->id)),
                TextColumn::make('plan_name')
                    ->label('Plan')
                    ->getStateUsing(function ($record) {
                        return $record->subscriptionWithProductDetails()?->plan?->display_name ?? 'Free';
                    }),
            ])
            ->filters([
                //
            ])
            ->actions([
//                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListTeams::route('/'),
//            'create' => Pages\CreateTeam::route('/create'),
//            'edit' => Pages\EditTeam::route('/{record}/edit'),
        ];
    }
}
