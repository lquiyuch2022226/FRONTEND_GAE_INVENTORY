

import './chat.css';
import { PrettyChatWindow } from "react-chat-engine-pretty";
import { useUserDetails } from "../../shared/hooks/useUserDetails";

export const Chat = () => {
    const { email } = useUserDetails();
    const secret = email;

    if (!email || email === "Guest") {
        return <div>Loading...</div>;
    }

    return (
        <div className="chat-container" style={{ height: "100vh", width: "100vw" }}>
            <PrettyChatWindow
                projectId="50899282-ea53-4964-90a3-83e9ff89d32a"
                username={email}
                secret={secret}
            />
        </div>
    );
};