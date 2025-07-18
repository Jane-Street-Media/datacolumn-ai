<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserSessionResource\Pages;
use App\Filament\Resources\UserSessionResource\RelationManagers;
use App\Models\UserSession;
use Carbon\Carbon;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserSessionResource extends Resource
{
    protected static ?string $model = UserSession::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

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
                TextColumn::make('user.name')
                    ->label('User')
                    ->sortable()
                    ->toggleable()
                    ->searchable(),
                TextColumn::make('logged_in_at')
                    ->label('Logged in at')
                    ->searchable()
                    ->toggleable()
                    ->sortable(),
                TextColumn::make('logged_out_at')
                    ->label('Logged out at')
                    ->searchable()
                    ->toggleable()
                    ->sortable(),
                TextColumn::make('last_activity')
                    ->label('Last activity')
                    ->searchable()
                    ->toggleable()
                    ->sortable(),
                TextColumn::make('total_session_time')
                    ->label('Total Session Time')
                    ->getStateUsing(function ($record) {
                        if ($record->logged_in_at && $record->logged_out_at) {
                            $start = Carbon::parse($record->logged_in_at);
                            $end = Carbon::parse($record->logged_out_at);
                            $diff = $start->diff($end);

                            return $diff->format('%H:%I:%S'); // HH:MM:SS format
                        }
                        return '—';
                    })
                    ->toggleable()
                    ->sortable()
                    ->searchable(false),
            ])
            ->filters([
                SelectFilter::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name') // Assumes your User model has a `name` attribute
                    ->searchable()
                    ->preload(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(

                ),
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
            'index' => Pages\ListUserSessions::route('/'),
//            'create' => Pages\CreateUserSession::route('/create'),
//            'edit' => Pages\EditUserSession::route('/{record}/edit'),
        ];
    }
}
