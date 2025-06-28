import * as React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'w-8 h-8 rounded border',
                        'focus:outline-none focus:ring-2 focus:ring-offset-1',
                        'border-gray-300',
                    )}
                    style={{ backgroundColor: value }}
                />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 p-0 border-none cursor-pointer"
                />
            </PopoverContent>
        </Popover>
    );
}
