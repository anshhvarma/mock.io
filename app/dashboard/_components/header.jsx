'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function header() {
    const path = usePathname();
    useEffect(() => {
        console.log(path)
    }, [])
    return (
        <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
            <Image
                src={'/logo.png'}
                width={50}
                height={50}
                alt='logo'
            />
            <ul className='hidden md:flex gap-6'>
                <li className={`
            hover:text-primary hover:font-bold cursor-pointer transition-all
            ${path == '/dashboard' && 'text-primary font-bold'}
            `}>Dashboard</li>
                <li className={`
            hover:text-primary hover:font-bold cursor-pointer transition-all
            ${path == '/questions' && 'text-primary font-bold'}
            `}>Questions</li>
                <li className={`
            hover:text-primary hover:font-bold cursor-pointer transition-all
            ${path == '/upgrade' && 'text-primary font-bold'}
            `}>Upgrade</li>
                <li className={`
            hover:text-primary hover:font-bold cursor-pointer transition-all
            ${path == '/howitworks' && 'text-primary font-bold'}
            `}>How it Works?</li>
            </ul>
            <UserButton />
        </div>
    )
}

export default header