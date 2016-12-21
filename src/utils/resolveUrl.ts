function resolveUrl(root, pathname) {
  const rootWihoutTrailingSlash = root.slice(-1) !== '/' ? root : root.slice(0, -1);
  const pathnameWithoutLeadingSlash = pathname[0] !== '/' ? pathname : pathname.slice(1);

  return rootWihoutTrailingSlash + '/' + pathnameWithoutLeadingSlash;
}

export {
  resolveUrl,
}
