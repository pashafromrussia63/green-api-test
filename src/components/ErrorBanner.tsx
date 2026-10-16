type Props = {
    message: string;
    onDismiss?: () => void;
};
  
export function ErrorBanner({ message, onDismiss }: Props) {
    return (
      <div className="error-banner" role="alert">
        <span>{message}</span>
        {onDismiss && (
          <button
            className="btn-close btn-close-sm"
            onClick={onDismiss}
            aria-label="Закрыть"
          />
        )}
      </div>
    );
}