export class MicrophoneSelector {
    private devices: MediaDeviceInfo[] = [];

    constructor() {
        this.refreshDevices();
    }

    private async refreshDevices(): Promise<void> {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(device => device.kind === 'audioinput');
        } catch (error) {
            console.error('Error fetching audio devices:', error);
        }
    }

    public async getDevices(): Promise<MediaDeviceInfo[]> {
        await this.refreshDevices();
        return this.devices;
    }
}
