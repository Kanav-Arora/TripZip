import {
    NovuProvider,
    PopoverNotificationCenter,
    NotificationBell,
} from "@novu/notification-center";
import { useAuth } from "../../../context/Auth/useAuth";

export default function NotificationCenter({ isDark }) {
    const { authStateValue } = useAuth();
    return (
        <NovuProvider
            subscriberId={authStateValue.uid}
            applicationIdentifier={process.env.REACT_APP_NOVU_APP_IDENTIFIER}
        >
            <PopoverNotificationCenter
                colorScheme="light"
            >
                {({ unseenCount }) => <NotificationBell unseenCount={unseenCount}
                    colorScheme="light"
                    unseenBadgeColor="red"
                    unseenBadgeBackgroundColor="red"
                />}
            </PopoverNotificationCenter>
        </NovuProvider>
    )
}
