'use client';

import { useState } from 'react';
import { useHeader } from '@/context/HeaderContext';

export default function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { config } = useHeader();

    return (
        <>
            <div className="mt-6 px-4 flex justify-between items-center app-header">
                {/* Left section: Back button */}
                <div className="flex-1 flex">
                    {config.backButton?.enabled && (
                        <button
                            onClick={config.backButton.onClick}
                            className="p-2 rounded-full hover:bg-cyan-700 transition"
                        >
                            ←
                        </button>
                    )}
                </div>

                {/* Center section: Title */}
                <div className="flex justify-center text-xl">{config.title || 'Toto Assistant'}</div>

                {/* Right section: Custom right icon, actions, and menu button */}
                <div className="flex flex-1 items-center justify-end p-1 flex-shrink-0 gap-2">
                    {config.rightIcon && (
                        <div className={`${config.rightIcon.size || "w-4 h-4"} ${config.rightIcon.color || "bg-cyan-800"}`}>
                            {/* Icon placeholder */}
                        </div>
                    )}
                    {config.actions}
                    {config.rightButton}

                    {/* Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-full hover:bg-cyan-700 transition"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Slide-out Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-64 shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col p-6 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ backgroundColor: 'var(--background)' }}
            >
                <div className="flex flex-col gap-4">
                    <MenuItem onClick={() => {setIsMenuOpen(false); window.location.href = "/"}} label="Home" />
                    <MenuItem onClick={() => {setIsMenuOpen(false);}} label="Settings" />
                </div>
            </div>
        </>
    );
}

function MenuItem({ onClick, label }: { onClick?: () => void, label: string }) {

    const [pressed, setPressed] = useState(false);

    return (
        <button
            onClick={onClick}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            className={`text-left p-3 rounded transition ${pressed ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
        >
            {label}
        </button>
    );
}
