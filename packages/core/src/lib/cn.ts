import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Concatene des classes Tailwind en resolvant les conflits (la derniere gagne). */
export const cn = (...classes: ClassValue[]): string => twMerge(clsx(classes))
