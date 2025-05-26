import React from 'react';

interface Props {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
}

export default function FormInput({ label, type, value, onChange, name }: Props) {
    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                value={value}
                name={name}
                onChange={onChange}
                required
            />
        </div>
    );
}