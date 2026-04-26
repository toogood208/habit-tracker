export default function SplashScreen() {

    return (
        <main data-testid="splash-screen"
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#183b3a] px-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(226,178,90,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(199,103,60,0.18),transparent_30%)]" />
            <div className="app-panel relative w-full max-w-md rounded-[2rem] px-8 py-10 text-center">
                <div className="mx-auto mb-4 h-3 w-24 rounded-full bg-[linear-gradient(90deg,#c7673c,#e2b25a)]" />
                <h1 className="text-4xl font-black tracking-tight text-[#183b3a]">
                    Habit Tracker
                </h1>
                <p className="mt-3 text-sm font-medium tracking-[0.08em] text-[#7a6652]">
                    Building small wins every day
                </p>
            </div>

        </main>
    )
}
