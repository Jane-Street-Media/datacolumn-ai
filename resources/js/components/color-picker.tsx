import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChangeEvent, useCallback, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {

    const timeoutRef = useRef<number | undefined>();
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const color = e.target.value;
            timeoutRef.current = window.setTimeout(() => onChange(color), 300);
        },
        [onChange]
    );

    const inputId = `color-picker-${Math.random().toString(36).substring(2, 15)}`;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="relative inline-block">
            <Button
                type="button"
                style={{ backgroundColor: value }}
                className={cn(
                    'w-8 h-8 rounded border',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer',
                    'border-gray-300'
                )}
                onClick={handleButtonClick}
            >
                <Label
                    className="w-full h-full"
                    htmlFor={inputId}
                />
            </Button>
            <input
                ref={inputRef}
                id={inputId}
                type="color"
                value={value}
                onChange={handleChange}
                className="w-10 h-10 p-0 border-none cursor-pointer absolute top-0 left-0 opacity-0"
            />
        </div>
    );
}
