"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {useTranslations} from 'next-intl';

export default function SignInButton() {
  const t = useTranslations('HomePage');
  return <Button onClick={() => signIn()}>{ t('signIn') }</Button>;
}
