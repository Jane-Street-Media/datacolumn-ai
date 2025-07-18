<?php

namespace App\Filament\Resources;

use App\Actions\Notifications\SendNotification;
use App\Enums\NotificationType;
use App\Filament\Resources\NotificationTemplateResource\Pages;
use App\Mail\InvitationSent;
use App\Models\NotificationTemplate;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationTemplateResource extends Resource
{
    protected static ?string $model = NotificationTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-c-bell';

    public static function form(Form $form): Form
    {
        $record = $form->getRecord();
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
                                'Applicable attributes are: ' . $record->type->getApplicableAttributes()
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
                Tables\Actions\Action::make('send_test_email')
                    ->form([
                        TextInput::make('email')
                            ->email()
                            ->required(),
                    ])
                    ->action(function (array $data, $record) {
                        $testUser = new \App\Models\User([
                            'name' => 'Test User',
                            'email' => $data['email'],
                        ]);

                        $oldPlan = $record->type == NotificationType::UPGRADE ? 'basic' : 'enterprise';
                        $newPlan = $record->type == NotificationType::UPGRADE ? 'enterprise' : 'basic';

                        if ($record->type == NotificationType::INVITATION) {
                            $testTeam = new \App\Models\TeamInvitation([
                                'email' => $data['email'],
                                'role' => 'member'
                            ]);
                            Mail::to($testTeam->email)->send(
                                new InvitationSent($testTeam, NotificationType::INVITATION)
                            );
                        } else {
                            app(SendNotification::class)->handle($testUser, $record->type, $oldPlan, $newPlan);
                        }

                        Notification::make()
                            ->title(__('Email sent!'))
                            ->success()
                            ->send();
                    })
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
            'edit' => Pages\EditNotificationTemplate::route('/{record}/edit'),
        ];
    }
}
