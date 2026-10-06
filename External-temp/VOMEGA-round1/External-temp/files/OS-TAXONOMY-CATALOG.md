# VIVIM OS Capability Taxonomy — Catalog

Taxonomy 0.1.0. CANDIDATE — first pass, owner-directed 2026-10-05. Capability ids are platform-neutral and human-friendly; realizations are per-platform implementations. Not frozen.

**291 capabilities** in 25 domains · Windows: 173 exact, 10 approximate, 108 hand-off (preferred realization). Average-user inventory: 164 tasks, 100% actionable, 68% exact. All realizations are `authored` — none verified on Windows yet.

Legend — risk: **R** read · **M** reversible change (journaled) · **X** consent required. Fidelity: ✅ exact · ≈ approximate · ↗ hand-off (opens the right place for the user).

## Power & Session (20)

Turn the device off, restart, sleep, lock, sign out, battery and power plans.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `power.device.shutdown`<br>Shut down the computer | shut down my computer | — | X | ✅ powershell |
| `power.device.restart`<br>Restart the computer | restart my computer | — | X | ✅ powershell |
| `power.session.lock`<br>Lock the screen | lock my screen | — | M | ✅ launch |
| `power.session.sign-out`<br>Sign out | sign me out | — | X | ✅ run |
| `power.device.sleep`<br>Put the computer to sleep | put the computer to sleep | — | M | ✅ powershell |
| `power.device.hibernate`<br>Hibernate the computer | hibernate the PC | — | M | ✅ powershell |
| `power.shutdown.schedule`<br>Schedule a shutdown | shut down in 30 minutes | minutes | X | ✅ powershell |
| `power.shutdown.cancel`<br>Cancel a scheduled shutdown | cancel the scheduled shutdown | — | M | ✅ run |
| `power.restart.advanced-startup`<br>Restart into advanced startup options | restart into advanced startup | — | X | ✅ run |
| `power.restart.firmware`<br>Restart into BIOS / UEFI setup | restart into the BIOS | — | X | ✅ run (admin) |
| `power.plan.show`<br>Show the active power plan | what power plan am I on? | — | R | ✅ run |
| `power.plan.list`<br>List power plans | show all power plans | — | R | ✅ run |
| `power.plan.set`<br>Change the power plan | switch to high performance | plan | M | ≈ run |
| `power.settings.open`<br>Open power & sleep settings | open power settings | — | M | ↗ uri |
| `power.battery.status`<br>Show battery level | how much battery do I have? | — | R | ✅ powershell |
| `power.battery.report`<br>Create a battery health report | generate a battery health report | — | M | ✅ powershell |
| `power.battery-saver.settings`<br>Open battery saver settings | turn on battery saver | — | M | ↗ uri |
| `power.screen-timeout.set`<br>Set when the screen turns off | turn the screen off after 10 minutes | minutes | M | ✅ powershell |
| `power.sleep-timeout.set`<br>Set when the computer sleeps | sleep after 30 minutes | minutes | M | ✅ powershell |
| `power.lid-action.settings`<br>Choose what closing the lid does | change what closing the lid does | — | M | ↗ launch |

## Display (16)

Brightness, night light, resolution, scaling and multiple monitors.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `display.settings.open`<br>Open display settings | open display settings | — | M | ↗ uri |
| `display.brightness.set`<br>Set screen brightness | set brightness to 70% | level | M | ✅ powershell |
| `display.brightness.increase`<br>Make the screen brighter | make the screen brighter | step? | M | ✅ powershell |
| `display.brightness.decrease`<br>Make the screen dimmer | dim the screen | step? | M | ✅ powershell |
| `display.brightness.show`<br>Show screen brightness | what's my brightness? | — | R | ✅ powershell |
| `display.night-light.settings`<br>Night light / blue-light filter | turn on night light | — | M | ↗ uri |
| `display.resolution.settings`<br>Change screen resolution | change my screen resolution | — | M | ↗ uri |
| `display.scale.settings`<br>Change text and app size (display scaling) | make everything on screen bigger | — | M | ↗ uri |
| `display.orientation.settings`<br>Rotate the screen | rotate my screen | — | M | ↗ uri |
| `display.refresh-rate.settings`<br>Change refresh rate / advanced display | change the refresh rate | — | M | ↗ uri |
| `display.graphics.settings`<br>Graphics preferences per app | make this app use the dedicated GPU | — | M | ↗ uri |
| `display.projection.set`<br>Choose how multiple displays are used | extend my display | mode | M | ✅ launch |
| `display.projection.menu`<br>Open the project / display mode menu | show projection options | — | M | ✅ keys |
| `display.wireless.connect`<br>Cast to a wireless display | cast my screen to the TV | — | M | ↗ keys |
| `display.adapters.info`<br>Show display adapter and resolution info | what graphics card do I have? | — | R | ✅ powershell |
| `display.screen.turn-off`<br>Turn off the screen now | turn off the screen | — | M | ✅ powershell |

## Sound (10)

Volume, mute, audio devices and microphone.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `sound.settings.open`<br>Open sound settings | open sound settings | — | M | ↗ uri |
| `sound.volume.up`<br>Turn the volume up | turn the volume up | steps? | M | ✅ keys |
| `sound.volume.down`<br>Turn the volume down | turn the volume down | steps? | M | ✅ keys |
| `sound.volume.set`<br>Set the volume | set volume to 30% | level | M | ≈ powershell |
| `sound.volume.mute`<br>Mute or unmute | mute the sound | — | M | ≈ keys |
| `sound.output.choose`<br>Choose the audio output device | switch audio to my headphones | device? | M | ↗ keys |
| `sound.devices.list`<br>List audio devices | what audio devices do I have? | — | R | ✅ powershell |
| `sound.app-volume.settings`<br>Set volume per app | change the volume for just one app | — | M | ↗ uri |
| `sound.classic-panel.open`<br>Open the classic Sound control panel | open playback devices | — | M | ↗ launch |
| `sound.microphone.settings`<br>Microphone / input settings | my microphone isn't working | — | M | ↗ uri |

## Media Playback (4)

Play, pause and skip whatever media is playing.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `media.playback.toggle`<br>Play or pause media | pause the music | — | M | ✅ keys |
| `media.track.next`<br>Next track | skip this song | — | M | ✅ keys |
| `media.track.previous`<br>Previous track | previous song | — | M | ✅ keys |
| `media.playback.stop`<br>Stop media playback | stop the music | — | M | ✅ keys |

## Network & Internet (26)

Wi-Fi, connectivity, IP addresses, VPN, hotspot and proxy.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `network.settings.open`<br>Open network & internet settings | open network settings | — | M | ↗ uri |
| `network.wifi.settings`<br>Open Wi-Fi settings | open wifi settings | — | M | ↗ uri |
| `network.wifi.status`<br>Show Wi-Fi connection status | which wifi am I on? | — | R | ✅ run |
| `network.wifi.available`<br>List available Wi-Fi networks | what wifi networks are around? | — | R | ✅ run |
| `network.wifi.connect`<br>Connect to a Wi-Fi network | connect to HomeNetwork wifi | ssid | M | ✅ run |
| `network.wifi.disconnect`<br>Disconnect from Wi-Fi | disconnect from wifi | — | M | ✅ run |
| `network.wifi.saved`<br>List saved Wi-Fi networks | show my saved wifi networks | — | R | ✅ run |
| `network.wifi.forget`<br>Forget a saved Wi-Fi network | forget the CoffeeShop network | ssid | X | ✅ run |
| `network.wifi.password`<br>Show a saved Wi-Fi password | what's the wifi password? | ssid | X | ✅ run |
| `network.wifi.toggle`<br>Turn Wi-Fi on or off | turn off wifi | state | M | ✅ run (admin) |
| `network.airplane-mode.settings`<br>Airplane mode | turn on airplane mode | — | M | ↗ uri |
| `network.adapters.status`<br>Show network adapters | is my ethernet connected? | — | R | ✅ powershell |
| `network.ip.show`<br>Show my local IP address | what's my IP address? | — | R | ✅ powershell |
| `network.ip.public`<br>Show my public IP address | what's my public IP? | — | X | ✅ powershell |
| `network.connectivity.test`<br>Test the internet connection | is my internet working? | — | X | ✅ powershell |
| `network.host.ping`<br>Ping a host | ping google.com | host | X | ✅ powershell |
| `network.dns.flush`<br>Flush the DNS cache | flush the DNS cache | — | M | ✅ powershell |
| `network.reset.settings`<br>Network reset | reset my network settings | — | M | ↗ uri |
| `network.vpn.settings`<br>VPN settings | open VPN settings | — | M | ↗ uri |
| `network.vpn.list`<br>List VPN connections | what VPNs do I have? | — | R | ✅ powershell |
| `network.vpn.connect`<br>Connect to a VPN | connect to my work VPN | name | M | ✅ run |
| `network.vpn.disconnect`<br>Disconnect the VPN | disconnect the VPN | — | M | ✅ run |
| `network.hotspot.settings`<br>Mobile hotspot | turn on my hotspot | — | M | ↗ uri |
| `network.proxy.settings`<br>Proxy settings | change proxy settings | — | M | ↗ uri |
| `network.data-usage.show`<br>Show data usage | how much data have I used? | — | M | ↗ uri |
| `network.connections.panel`<br>Open network connections (adapters) | open network adapter settings | — | M | ↗ launch |

## Bluetooth & Devices (20)

Bluetooth, printers, drives, mouse, touchpad and other peripherals.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `devices.bluetooth.settings`<br>Bluetooth settings | open bluetooth settings | — | M | ↗ uri |
| `devices.bluetooth.pair`<br>Pair a new device | pair my new headphones | — | M | ↗ uri |
| `devices.bluetooth.toggle`<br>Turn Bluetooth on or off | turn off bluetooth | state? | M | ↗ uri |
| `devices.bluetooth.list`<br>List Bluetooth devices | what bluetooth devices are paired? | — | R | ≈ powershell |
| `devices.printers.list`<br>List printers | what printers do I have? | — | R | ✅ powershell |
| `devices.printer.default`<br>Set the default printer | make the office printer my default | printer | M | ✅ powershell |
| `devices.printers.settings`<br>Printers & scanners settings | add a printer | — | M | ↗ uri |
| `devices.print-queue.open`<br>Open a printer's queue | show the print queue | printer | M | ↗ launch |
| `devices.print.file`<br>Print a file | print this document | path | X | ≈ powershell |
| `devices.print.test-page`<br>Print a test page | print a test page | printer | X | ✅ launch |
| `devices.manager.open`<br>Open Device Manager | open device manager | — | M | ↗ launch |
| `devices.drives.removable`<br>List USB / removable drives | is my USB drive connected? | — | R | ✅ powershell |
| `devices.drive.eject`<br>Safely eject a drive | eject the USB drive E | drive | M | ≈ powershell |
| `devices.mouse.settings`<br>Mouse settings | change my mouse speed | — | M | ↗ uri |
| `devices.touchpad.settings`<br>Touchpad settings | change touchpad gestures | — | M | ↗ uri |
| `devices.pen.settings`<br>Pen & Windows Ink settings | change pen settings | — | M | ↗ uri |
| `devices.autoplay.settings`<br>AutoPlay settings | stop things opening when I plug in a USB | — | M | ↗ uri |
| `devices.camera.settings`<br>Camera settings | adjust my webcam | — | M | ↗ uri |
| `devices.phone.settings`<br>Phone link settings | link my phone | — | M | ↗ uri |
| `devices.game-controllers.open`<br>Game controllers | test my game controller | — | M | ↗ launch |

## Files & Folders (29)

Open, find, create, rename, move, copy, delete and compress files.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `files.known-folder.open`<br>Open a common folder | open my downloads | folder | M | ✅ launch |
| `files.explorer.open`<br>Open the file manager | open file explorer | — | M | ✅ launch |
| `files.folder.open`<br>Open a folder | open C:\Projects | path | M | ✅ launch |
| `files.item.open`<br>Open a file | open report.pdf | path | M | ✅ powershell |
| `files.item.reveal`<br>Show a file in its folder | show me where report.pdf is | path | M | ✅ powershell |
| `files.item.open-with`<br>Open a file with a chosen app | open this with a different app | path | M | ↗ launch |
| `files.item.info`<br>Show file details | how big is report.pdf? | path | R | ✅ powershell |
| `files.folder.list`<br>List a folder's contents | what's in my downloads folder? | path | R | ✅ powershell |
| `files.folder.create`<br>Create a folder | create a folder called Taxes on my desktop | path | M | ✅ powershell |
| `files.file.create`<br>Create a text file | create a new text file called notes.txt | path, text? | M | ✅ powershell |
| `files.item.rename`<br>Rename a file or folder | rename draft.docx to final.docx | path, newName | M | ✅ powershell |
| `files.item.move`<br>Move a file or folder | move report.pdf to Documents | path, destination | M | ✅ powershell |
| `files.item.copy`<br>Copy a file or folder | copy the photos folder to my USB drive | path, destination | M | ✅ powershell |
| `files.item.delete`<br>Move a file or folder to the Recycle Bin | delete old-report.pdf | path | X | ✅ powershell |
| `files.item.delete-permanently`<br>Permanently delete a file or folder | permanently delete the temp folder | path | X | ✅ powershell |
| `files.recycle-bin.open`<br>Open the Recycle Bin | open the recycle bin | — | M | ✅ launch |
| `files.recycle-bin.empty`<br>Empty the Recycle Bin | empty the recycle bin | — | X | ✅ powershell |
| `files.recycle-bin.count`<br>How many items are in the Recycle Bin | how full is the recycle bin? | — | R | ✅ powershell |
| `files.archive.create`<br>Compress into a zip file | zip the photos folder | path, destination | M | ✅ powershell |
| `files.archive.extract`<br>Extract a zip file | unzip archive.zip | path, destination | M | ✅ powershell |
| `files.items.search`<br>Find files by name | find my resume file | query, location? | R | ✅ powershell |
| `files.search.ui`<br>Search in the file manager | search my files for invoice | query | M | ✅ uri |
| `files.recent.list`<br>Recently used files | show my recent files | — | R | ✅ powershell |
| `files.folder.size`<br>Show a folder's size | how big is my downloads folder? | path | R | ✅ powershell |
| `files.path.copy`<br>Copy a file's path | copy the path of this file | path | M | ✅ powershell |
| `files.shortcut.create`<br>Create a desktop shortcut | put a shortcut to the projects folder on my desktop | target, name | M | ✅ powershell |
| `files.hidden-items.set`<br>Show or hide hidden files | show hidden files | visible | M | ✅ powershell |
| `files.extensions.set`<br>Show or hide file extensions | show file extensions | visible | M | ✅ powershell |
| `files.terminal.here`<br>Open a terminal in a folder | open a terminal in my projects folder | path | M | ✅ launch |

## Storage (7)

Disk space, cleanup and drive tools.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `storage.settings.open`<br>Storage settings | free up disk space | — | M | ↗ uri |
| `storage.drives.list`<br>Show drives and free space | how much space is left on my drive? | — | R | ✅ powershell |
| `storage.cleanup.open`<br>Disk Cleanup | run disk cleanup | — | M | ↗ launch |
| `storage.optimize.open`<br>Optimize / defragment drives | defrag my drive | — | M | ↗ launch |
| `storage.disk-management.open`<br>Disk Management | open disk management | — | M | ↗ launch |
| `storage.large-files.find`<br>Find the largest files | what's taking up all my space? | location? | R | ✅ powershell |
| `storage.temp.clear`<br>Delete temporary files | clear my temp files | — | X | ✅ powershell |

## Apps (18)

Open, close, install, update, uninstall and default apps.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `apps.builtin.open`<br>Open a built-in app | open the calculator | app | M | ✅ builtin-map |
| `apps.app.open`<br>Open an installed app by name | open Spotify | app | M | ✅ powershell |
| `apps.app.close`<br>Close an app | close Spotify | process | M | ✅ powershell |
| `apps.app.force-quit`<br>Force-quit an app | force quit Chrome, it's frozen | process | X | ✅ powershell |
| `apps.installed.list`<br>List installed apps | what apps do I have installed? | — | R | ✅ powershell |
| `apps.running.list`<br>List open apps | what apps are open? | — | R | ✅ powershell |
| `apps.catalog.search`<br>Search for apps to install | find a PDF reader to install | query | X | ✅ run |
| `apps.app.install`<br>Install an app | install VLC | packageId | X | ✅ run |
| `apps.app.uninstall`<br>Uninstall an app | uninstall Candy Crush | packageId | X | ✅ run |
| `apps.app.update`<br>Update an app | update Firefox | packageId | X | ✅ run |
| `apps.updates.list`<br>List app updates available | which apps need updating? | — | X | ✅ run |
| `apps.updates.install-all`<br>Update all apps | update all my apps | — | X | ✅ run |
| `apps.store.search`<br>Search the app store | search the store for Netflix | query | M | ✅ uri |
| `apps.settings.open`<br>Installed apps settings | manage my installed apps | — | M | ↗ uri |
| `apps.defaults.settings`<br>Default apps | change my default browser | — | M | ↗ uri |
| `apps.startup.settings`<br>Startup apps | stop apps from starting at boot | — | M | ↗ uri |
| `apps.startup.list`<br>List startup apps | what runs at startup? | — | R | ✅ powershell |
| `apps.optional-features.settings`<br>Optional features | add an optional feature | — | M | ↗ uri |

## Window Management (14)

Show desktop, minimize, snap, task overview and virtual desktops.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `windows.desktop.show`<br>Show the desktop | show the desktop | — | M | ✅ powershell |
| `windows.all.minimize`<br>Minimize all windows | minimize all windows | — | M | ✅ powershell |
| `windows.all.restore`<br>Restore minimized windows | bring my windows back | — | M | ✅ powershell |
| `windows.active.close`<br>Close the current window | close this window | — | M | ✅ keys |
| `windows.active.minimize`<br>Minimize the current window | minimize this window | — | M | ≈ keys |
| `windows.active.maximize`<br>Maximize the current window | maximize this window | — | M | ✅ keys |
| `windows.active.snap`<br>Snap the current window to a side | snap this window to the left | side | M | ✅ keys |
| `windows.active.move-monitor`<br>Move the current window to another monitor | move this window to my other screen | direction? | M | ✅ keys |
| `windows.snap-layouts.open`<br>Snap layouts | show snap layouts | — | M | ✅ keys |
| `windows.overview.open`<br>Show all open windows | show me all my windows | — | M | ✅ keys |
| `windows.virtual-desktop.new`<br>Create a new virtual desktop | create a new desktop | — | M | ✅ keys |
| `windows.virtual-desktop.close`<br>Close the current virtual desktop | close this desktop | — | M | ✅ keys |
| `windows.virtual-desktop.switch`<br>Switch virtual desktop | go to the next desktop | direction | M | ✅ keys |
| `windows.multitasking.settings`<br>Multitasking settings | turn off snap | — | M | ↗ uri |

## Input & Text (11)

Clipboard, emoji, dictation, typing and keyboard layouts.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `input.clipboard.get`<br>Read the clipboard | what's on my clipboard? | — | X | ✅ powershell |
| `input.clipboard.set`<br>Copy text to the clipboard | copy 'hello world' to the clipboard | text | M | ✅ powershell |
| `input.clipboard.clear`<br>Clear the clipboard | clear my clipboard | — | M | ✅ powershell |
| `input.clipboard.history`<br>Show clipboard history | show my clipboard history | — | M | ✅ keys |
| `input.clipboard.settings`<br>Clipboard settings | turn on clipboard history | — | M | ↗ uri |
| `input.emoji.open`<br>Emoji picker | insert an emoji | — | M | ✅ keys |
| `input.dictation.start`<br>Start voice typing | start voice typing | — | M | ✅ keys |
| `input.text.type`<br>Type text into the current app | type my address | text | M | ✅ powershell |
| `input.keyboard-layout.switch`<br>Switch keyboard language / layout | switch to my Spanish keyboard | — | M | ≈ keys |
| `input.typing.settings`<br>Typing settings (autocorrect, suggestions) | turn off autocorrect | — | M | ↗ uri |
| `input.speech.settings`<br>Speech settings | change speech language | — | M | ↗ uri |

## Personalization (15)

Dark/light mode, wallpaper, colors, taskbar and start menu.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `personalize.color-mode.set`<br>Switch dark / light mode | turn on dark mode | mode | M | ✅ powershell |
| `personalize.color-mode.show`<br>Am I in dark or light mode | am I in dark mode? | — | R | ✅ powershell |
| `personalize.wallpaper.set`<br>Set the desktop wallpaper | set this photo as my wallpaper | path | M | ✅ powershell |
| `personalize.wallpaper.show`<br>Which wallpaper is set | what's my wallpaper? | — | R | ✅ powershell |
| `personalize.background.settings`<br>Background settings | change my background | — | M | ↗ uri |
| `personalize.accent.settings`<br>Accent color | change the accent color | — | M | ↗ uri |
| `personalize.themes.settings`<br>Themes | change my theme | — | M | ↗ uri |
| `personalize.lock-screen.settings`<br>Lock screen settings | change the lock screen picture | — | M | ↗ uri |
| `personalize.taskbar.settings`<br>Taskbar settings | auto-hide the taskbar | — | M | ↗ uri |
| `personalize.taskbar.alignment`<br>Align taskbar icons left or center | move the start button to the left | alignment | M | ✅ powershell |
| `personalize.start.settings`<br>Start menu settings | customize the start menu | — | M | ↗ uri |
| `personalize.fonts.settings`<br>Fonts | install a font | — | M | ↗ uri |
| `personalize.transparency.set`<br>Turn transparency effects on or off | turn off transparency effects | enabled | M | ✅ powershell |
| `personalize.screensaver.settings`<br>Screen saver | set a screen saver | — | M | ↗ launch |
| `personalize.sounds.settings`<br>System sounds | turn off system sounds | — | M | ↗ launch |

## Accessibility (18)

Text size, magnifier, screen reader, contrast, captions and assistive input.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `a11y.settings.open`<br>Accessibility settings | open accessibility settings | — | M | ↗ uri |
| `a11y.text-size.settings`<br>Make text bigger | make the text bigger | — | M | ↗ uri |
| `a11y.magnifier.start`<br>Turn on Magnifier | turn on the magnifier | — | M | ✅ launch |
| `a11y.magnifier.stop`<br>Turn off Magnifier | turn off the magnifier | — | M | ✅ powershell |
| `a11y.magnifier.zoom`<br>Zoom Magnifier in or out | zoom in more | direction | M | ✅ keys |
| `a11y.narrator.start`<br>Turn on the screen reader | turn on narrator | — | M | ✅ launch |
| `a11y.narrator.stop`<br>Turn off the screen reader | turn off narrator | — | M | ✅ powershell |
| `a11y.narrator.settings`<br>Screen reader settings | narrator voice settings | — | M | ↗ uri |
| `a11y.contrast.settings`<br>High contrast / contrast themes | turn on high contrast | — | M | ↗ uri |
| `a11y.color-filters.settings`<br>Color filters (color blindness) | turn on a color blindness filter | — | M | ↗ uri |
| `a11y.captions.settings`<br>Caption style settings | change caption style | — | M | ↗ uri |
| `a11y.live-captions.start`<br>Turn on live captions | turn on live captions | — | M | ✅ keys |
| `a11y.mouse-pointer.settings`<br>Mouse pointer size and color | make the mouse pointer bigger | — | M | ↗ uri |
| `a11y.text-cursor.settings`<br>Text cursor thickness | make the text cursor thicker | — | M | ↗ uri |
| `a11y.keyboard.settings`<br>Accessibility keyboard (sticky keys, filter keys) | turn off sticky keys | — | M | ↗ uri |
| `a11y.on-screen-keyboard.open`<br>On-screen keyboard | show the on-screen keyboard | — | M | ✅ launch |
| `a11y.audio.settings`<br>Mono audio and audio accessibility | turn on mono audio | — | M | ↗ uri |
| `a11y.voice-access.start`<br>Voice access (control by voice) | start voice access | — | M | ✅ launch |

## Privacy (6)

Camera, microphone, location and data permissions.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `privacy.settings.open`<br>Privacy settings | open privacy settings | — | M | ↗ uri |
| `privacy.camera.settings`<br>Camera permissions | which apps can use my camera? | — | M | ↗ uri |
| `privacy.microphone.settings`<br>Microphone permissions | which apps can use my microphone? | — | M | ↗ uri |
| `privacy.location.settings`<br>Location permissions | turn off location | — | M | ↗ uri |
| `privacy.activity-history.settings`<br>Activity history | clear my activity history | — | M | ↗ uri |
| `privacy.diagnostics.settings`<br>Diagnostics & feedback data | reduce diagnostic data | — | M | ↗ uri |

## Security (10)

Antivirus, firewall, encryption and device-finding.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `security.center.open`<br>Open the security app | open windows security | — | M | ✅ uri |
| `security.virus.quick-scan`<br>Run a quick virus scan | scan my computer for viruses | — | M | ✅ run |
| `security.virus.full-scan`<br>Run a full virus scan | do a full virus scan | — | M | ✅ run |
| `security.virus.update`<br>Update virus definitions | update my virus definitions | — | X | ✅ run |
| `security.virus.status`<br>Antivirus status | is my antivirus on? | — | R | ✅ powershell |
| `security.virus.threats`<br>Recently detected threats | did the antivirus find anything? | — | R | ✅ powershell |
| `security.firewall.status`<br>Firewall status | is my firewall on? | — | R | ✅ powershell |
| `security.firewall.settings`<br>Firewall settings | allow an app through the firewall | — | M | ↗ launch |
| `security.find-device.settings`<br>Find my device | turn on find my device | — | M | ↗ uri |
| `security.encryption.settings`<br>Device encryption / BitLocker | is my drive encrypted? | — | M | ↗ uri |

## Accounts & Sign-in (8)

Current user, sign-in methods and other users.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `accounts.user.show`<br>Who am I signed in as | what user am I signed in as? | — | R | ✅ powershell |
| `accounts.info.settings`<br>Your account info | change my account picture | — | M | ↗ uri |
| `accounts.sign-in.settings`<br>Sign-in options (PIN, password, face, fingerprint) | change my password | — | M | ↗ uri |
| `accounts.email.settings`<br>Email & accounts | add my work account | — | M | ↗ uri |
| `accounts.other-users.settings`<br>Family & other users | add a user for my kid | — | M | ↗ uri |
| `accounts.local.list`<br>List user accounts on this device | who has an account on this PC? | — | R | ✅ powershell |
| `accounts.user.switch`<br>Switch user | switch to another user | — | M | ≈ launch |
| `accounts.backup.settings`<br>Account backup & sync | back up my settings | — | M | ↗ uri |

## Time & Clock (8)

Time, date, time zone, timers and alarms.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `time.now.show`<br>What time / date is it | what time is it? | — | R | ✅ powershell |
| `time.zone.show`<br>Show the time zone | what time zone am I in? | — | R | ✅ powershell |
| `time.zone.list`<br>List time zones | show available time zones | — | R | ✅ powershell |
| `time.zone.set`<br>Change the time zone | set my time zone to Central European | zoneId | M | ✅ powershell |
| `time.settings.open`<br>Date & time settings | the clock is wrong | — | M | ↗ uri |
| `time.sync.now`<br>Sync the clock now | sync my clock | — | M | ✅ run (admin) |
| `time.timer.start`<br>Start a timer | set a timer for 10 minutes | minutes? | M | ↗ uri |
| `time.alarm.set`<br>Set an alarm | set an alarm for 7am | time? | M | ↗ uri |

## Language & Region (3)

Display language, input languages and regional formats.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `language.settings.open`<br>Language settings | change my display language | — | M | ↗ uri |
| `language.region.settings`<br>Region & formats | change the date format | — | M | ↗ uri |
| `language.list.show`<br>Installed languages | what languages are installed? | — | R | ✅ powershell |

## Notifications & Focus (4)

Notification center, do-not-disturb and notification settings.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `notify.settings.open`<br>Notification settings | stop an app from sending notifications | — | M | ↗ uri |
| `notify.center.open`<br>Show notifications | show my notifications | — | M | ✅ keys |
| `notify.do-not-disturb.set`<br>Do not disturb / focus | turn on do not disturb | state? | M | ↗ uri |
| `notify.quick-settings.open`<br>Quick settings panel | open quick settings | — | M | ✅ keys |

## Screen Capture (6)

Screenshots and screen recording.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `capture.screenshot.region`<br>Screenshot part of the screen | take a screenshot | — | M | ✅ uri |
| `capture.screenshot.full`<br>Screenshot the whole screen to a file | screenshot my whole screen | — | M | ✅ keys |
| `capture.screenshot.save`<br>Save a screenshot to a specific file | save a screenshot to my desktop | path | M | ✅ powershell |
| `capture.screenshot.window`<br>Screenshot the current window to the clipboard | screenshot this window | — | M | ✅ keys |
| `capture.screen.record`<br>Record the screen | record my screen | — | M | ≈ keys |
| `capture.game-bar.open`<br>Game bar | open the game bar | — | M | ✅ keys |

## Web (3)

Open websites, search the web and maps.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `web.url.open`<br>Open a website | open youtube.com | url | X | ✅ powershell |
| `web.search.query`<br>Search the web | search the web for pasta recipes | query, engine? | X | ✅ powershell |
| `web.maps.search`<br>Find a place on the map | show me Palma on a map | place | X | ✅ uri |

## System Search (1)

The operating system's own search surface.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `search.system.open`<br>Open system search | open search | — | M | ✅ keys |

## System Updates (6)

Check, pause and review operating-system updates.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `updates.settings.open`<br>System updates | open windows update | — | M | ↗ uri |
| `updates.system.check`<br>Check for system updates | check for updates | — | M | ✅ uri |
| `updates.history.open`<br>Update history | what updates were installed? | — | M | ↗ uri |
| `updates.recent.list`<br>Recently installed updates | list recent updates | — | R | ✅ powershell |
| `updates.system.pause`<br>Pause updates | pause windows updates | — | M | ↗ uri |
| `updates.restart-options.open`<br>Schedule the update restart | don't restart for updates during work hours | — | M | ↗ uri |

## System Info & Tools (20)

Specs, version, performance, task manager and admin tools.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `system.run-dialog.open`<br>Open the Run dialog | open the run box | — | M | ✅ keys |
| `system.about.open`<br>About this device | show my PC specs | — | M | ↗ uri |
| `system.info.summary`<br>System summary (model, OS, CPU, memory) | how much RAM do I have? | — | R | ✅ powershell |
| `system.version.show`<br>Which OS version | what version of Windows do I have? | — | R | ✅ powershell |
| `system.performance.show`<br>CPU and memory usage | why is my computer slow? | — | R | ✅ powershell |
| `system.uptime.show`<br>How long since restart | when did I last restart? | — | R | ✅ powershell |
| `system.name.show`<br>Computer name | what's my computer's name? | — | R | ✅ powershell |
| `system.name.rename`<br>Rename this computer | rename my PC to Studio | name | X | ✅ powershell (admin) |
| `system.activation.settings`<br>Activation / license | is Windows activated? | — | M | ↗ uri |
| `system.task-manager.open`<br>Open the task manager | open task manager | — | M | ✅ launch |
| `system.control-panel.open`<br>Control Panel | open control panel | — | M | ✅ launch |
| `system.event-viewer.open`<br>Event Viewer (system logs) | show system error logs | — | M | ↗ launch |
| `system.services.open`<br>Services | open services | — | M | ↗ launch |
| `system.resource-monitor.open`<br>Resource Monitor | open resource monitor | — | M | ✅ launch |
| `system.reliability.open`<br>Reliability history | why does my PC keep crashing? | — | M | ↗ launch |
| `system.environment-variables.open`<br>Environment variables | edit environment variables | — | M | ↗ launch |
| `system.remote-desktop.settings`<br>Remote desktop settings | let me connect to this PC remotely | — | M | ↗ uri |
| `system.troubleshoot.open`<br>Troubleshooters | troubleshoot my sound | — | M | ↗ uri |
| `system.help.open`<br>Get help / contact support | I need help with Windows | — | M | ✅ uri |
| `system.developer.settings`<br>Developer settings | turn on developer mode | — | M | ↗ uri |

## Maintenance & Recovery (8)

Restore points, repair, reset and backup.

| Capability | Say it like | Params | Risk | Windows |
| --- | --- | --- | --- | --- |
| `maintenance.restore-point.create`<br>Create a restore point | create a restore point before I install this | description? | M | ✅ powershell (admin) |
| `maintenance.system-restore.open`<br>System Restore | restore my PC to yesterday | — | M | ↗ launch |
| `maintenance.recovery.settings`<br>Recovery / reset this PC | reset this PC | — | M | ↗ uri |
| `maintenance.file-history.open`<br>File History backup | back up my files | — | M | ↗ launch |
| `maintenance.system-files.repair`<br>Repair system files | repair corrupted system files | — | X | ✅ run (admin) |
| `maintenance.image.repair`<br>Repair the system image (DISM) | run DISM restore health | — | X | ✅ run (admin) |
| `maintenance.disk.check`<br>Check a drive for errors (read-only) | check my drive for errors | drive? | R | ✅ run (admin) |
| `maintenance.memory.test`<br>Test memory (RAM) | test my RAM | — | X | ↗ launch |
