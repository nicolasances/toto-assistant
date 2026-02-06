'use client';

import { useState } from 'react';
import { useHeader } from '@/context/HeaderContext';
import RoundButton from '@/components/RoundButton';

export default function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { config } = useHeader();

    return (
        <>
            <div className="mt-6 px-4 flex justify-between items-center app-header">
                {/* Left section: Back button */}
                <div className="flex-1 flex">
                    {config.backButton?.enabled && (
                        <RoundButton
                            svgIconPath={{
                                src: "/images/home.svg",
                                alt: "Back"
                            }}
                            onClick={config.backButton.onClick}
                            size="s"
                            secondary
                        />
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
                    <RoundButton
                        svgIconPath={{
                            src: "/images/menu.svg",
                            alt: "Menu"
                        }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        size="s"
                        slim
                    />
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
                    <MenuItem onClick={() => {setIsMenuOpen(false); window.location.href = "/"}} icon="/images/home.svg" label="Home" />
                    <MenuItem onClick={() => {setIsMenuOpen(false); window.location.href = "/settings"}} icon="/images/settings.svg" label="Settings" />
                </div>
            </div>
        </>
    );
}

function MenuItem({ onClick, icon, label }: { onClick?: () => void, icon: string, label: string }) {

    const [pressed, setPressed] = useState(false);

    return (
        <button
            onClick={onClick}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            className={`flex items-center gap-3 text-left p-3 rounded transition ${pressed ? 'bg-cyan-700' : 'hover:bg-cyan-700'}`}
        >
            <img src={icon} alt={label} className="w-5 h-5" />
            {label}
        </button>
    );
}
