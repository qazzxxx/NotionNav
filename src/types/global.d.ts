interface Window {
  handleLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
}