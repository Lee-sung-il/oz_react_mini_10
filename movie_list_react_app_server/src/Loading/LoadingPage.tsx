function LoadingSpinner() {
    return (
        <div className="w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"/>
    );
}

function LoadingMessage({message}: { message: string }) {
    return <div className="text-lg text-gray-600">{message}</div>;
}

export function LoadingPage({ message = "로딩 중..." }: { message?: string }) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                <LoadingSpinner/>
                <LoadingMessage message={message}/>
            </div>
        </div>
    );
}