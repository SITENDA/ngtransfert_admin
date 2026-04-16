import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

interface LinkProps {
    href?: string
}

export const {Link, redirect, usePathname, useRouter, getPathname} =
    createNavigation(routing);