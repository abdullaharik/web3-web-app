import { type Message } from "ai";

import { ChatMessage } from "components/ai/chat-message";
import React from "react";

export interface ChatListInterface {
  messages: Message[];
  handleEditClick: (message: Message, index: number) => void;
  editingMessage: Message | undefined;
  setEditInput: (input: string) => void;
  editInput: string;
  handleSaveEdit: () => void;
  editingIndex: number | undefined;
}

export const ChatList = ({
  messages,
  handleEditClick,
  editingMessage,
  setEditInput,
  editInput,
  handleSaveEdit,
  editingIndex,
}: ChatListInterface) => {
  if (!messages.length) {
    return null;
  }
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage
            message={message}
            handleEditClick={handleEditClick}
            editingMessage={editingMessage}
            setEditInput={setEditInput}
            editInput={editInput}
            handleSaveEdit={handleSaveEdit}
            index={index}
            editingIndex={editingIndex}
          />
        </div>
      ))}
      <div style={{ width: "100%", height: "15rem" }}></div>
    </div>
  );
};
