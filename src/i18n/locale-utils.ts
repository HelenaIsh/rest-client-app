export function toggleToOtherLocale(currentLocale: string, pathname: string) {
  const newLocale = currentLocale === 'en' ? 'ru' : 'en';
  const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
  return newPathname;
}
