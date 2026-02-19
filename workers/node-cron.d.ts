declare module 'node-cron' {
    interface ScheduledTask {
        start: () => void
        stop: () => void
        destroy: () => void
    }

    interface ScheduleOptions {
        scheduled?: boolean
        timezone?: string
    }

    function schedule(
        cronExpression: string,
        task: () => void | Promise<void>,
        options?: ScheduleOptions
    ): ScheduledTask

    const cron: {
        schedule: typeof schedule
    }

    export { schedule, ScheduledTask, ScheduleOptions }
    export default cron
}
