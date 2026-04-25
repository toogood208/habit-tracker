export default function SplashScreen() {

    return (
        <main data-testid="splash-screen"
            className="flex min-h-screen items-center justify-center bg-slate-950 px-6">

            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Habit Tracker
                </h1>
                <p className="mt-3 text-sm text-slate-300">
                    Building Small wins every day
                </p>
            </div>

        </main>
    )
}