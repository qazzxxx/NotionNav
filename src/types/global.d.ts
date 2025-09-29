interface Window {
  handleLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, url: string, target?: string) => void;
}