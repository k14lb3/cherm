import React, { useRef, useEffect, useState } from 'react';
import {
  Unsubscribe,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { command, notification } from '@/utils/constants';
import useStore, { Chat } from '@/store';
import { db } from '@/firebase';
import Prompt from '@/components/prompt';
import Message from '@/components/message';
import { Notification, Help } from '@/components/ui';

const ChatBox: React.FC = () => {
  const uid = useStore((state) => state.uid);
  const input = useStore((state) => state.input);
  const chat = useStore((state) => state.chat);
  const roomId = useStore((state) => state.roomId);
  const setChat = useStore((state) => state.setChat);
  const setInput = useStore((state) => state.setInput);
  const enterInput = useStore((state) => state.enterInput);
  const clearInput = useStore((state) => state.clearInput);
  const setRoomId = useStore((state) => state.setRoomId);
  const inputRef = useRef<HTMLInputElement>(null);
  const unsubRoomRef = useRef<Unsubscribe>();
  const unsubRoomChatRef = useRef<Unsubscribe>();
  const [chatting, setChatting] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [cursor, setCursor] = useState<{
    visible: boolean;
    pos: number;
  }>({
    visible: true,
    pos: 0,
  });

  const search = async () => {
    const roomsRef = collection(db, 'rooms');

    const joinRoom = async () => {
      const roomsColSnapshot = await getDocs(
        query(roomsRef, orderBy('timestamp'), where('available', '==', true)),
      );

      if (roomsColSnapshot.empty) {
        return false;
      }

      const roomId = roomsColSnapshot.docs[0].id;

      setRoomId(roomId);

      await addDoc(collection(roomsRef, roomId, 'chat'), {
        uid: 'system',
        message: notification.chatting,
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(roomsRef, roomId), {
        available: false,
      });

      unsubRoomRef.current = onSnapshot(doc(roomsRef, roomId), async (doc) => {
        const room = doc.data();

        if (!room!.active) {
          const roomChatColSnapshot = await getDocs(
            query(collection(roomsRef, roomId, 'chat'), orderBy('timestamp')),
          );

          const chat = roomChatColSnapshot.docs.map(
            (doc) => doc.data() as Chat,
          );

          setChat([
            ...chat,
            { uid: 'system', message: notification.disconnect.stranger },
          ]);

          setChatting(false);
        }
      });

      unsubRoomChatRef.current = onSnapshot(
        query(collection(roomsRef, roomId, 'chat'), orderBy('timestamp')),
        async (snapshot) =>
          setChat(snapshot.docs.map((doc) => doc.data() as Chat)),
      );

      setSearching(false);
      setChatting(true);
      clearInput();
      setCursor((cursor) => ({ ...cursor, visible: true }));

      return true;
    };

    const createRoom = async () => {
      await setDoc(doc(roomsRef, uid), {
        active: true,
        available: true,
        timestamp: serverTimestamp(),
      });

      setRoomId(uid);

      unsubRoomRef.current = onSnapshot(doc(roomsRef, uid), async (doc) => {
        const room = doc.data();

        if (!room!.active) return;

        if (!room!.available) {
          unsubRoomChatRef.current = onSnapshot(
            query(collection(roomsRef, uid, 'chat'), orderBy('timestamp')),
            async (snapshot) =>
              setChat(snapshot.docs.map((doc) => doc.data() as Chat)),
          );

          setSearching(false);
          setChatting(true);
          clearInput();
          setCursor((cursor) => ({ ...cursor, visible: true }));

          return;
        }
      });
    };

    setSearching(true);
    setCursor((cursor) => ({ ...cursor, visible: false }));

    const suc = await joinRoom();

    if (suc) {
      return;
    }

    await createRoom();
  };

  const stopSearch = async () => {
    const roomsRef = collection(db, 'rooms');

    if (roomId) {
      unsubRoomRef.current && unsubRoomRef.current();
      unsubRoomChatRef.current && unsubRoomChatRef.current();

      await deleteDoc(doc(roomsRef, roomId));
    }

    setSearching(false);
    clearInput();
    setCursor((cursor) => ({ ...cursor, visible: true }));
  };

  const exitChat = async () => {
    const roomsRef = collection(db, 'rooms');

    await updateDoc(doc(roomsRef, roomId), {
      active: false,
    });

    setChat([...chat, { uid: 'system', message: notification.disconnect.me }]);

    setChatting(false);
  };

  const parseInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCursor((cursor) => ({ ...cursor, pos: 0 }));

    if (searching) return;

    if (!chatting && input === command.search) return search();

    if (chatting) {
      await addDoc(collection(collection(db, 'rooms'), roomId, 'chat'), {
        uid: uid,
        message: input,
        timestamp: serverTimestamp(),
      });
    } else {
      enterInput();
    }
    clearInput();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!chatting && roomId) {
      const deleteRoom = async () => {
        const roomsRef = collection(db, 'rooms');
        const chatsRef = collection(roomsRef, roomId, 'chat');
        const roomChatColSnapshot = await getDocs(chatsRef);

        roomChatColSnapshot.docs.forEach(async (snapshot) => {
          await deleteDoc(doc(chatsRef, snapshot.id));
        });

        await deleteDoc(doc(roomsRef, roomId));
      };

      unsubRoomRef.current && unsubRoomRef.current();

      unsubRoomChatRef.current && unsubRoomChatRef.current();

      deleteRoom();

      setRoomId('');

      return;
    }
  }, [chatting]);

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      const c = e.key.toLowerCase();

      switch (c) {
        case 'arrowup':
        case 'arrowright':
        case 'arrowdown':
        case 'arrowleft':
          if (e.shiftKey) e.preventDefault();
          return;
        case 'a':
          if (e.ctrlKey) e.preventDefault();
          return;
        case 'z':
          if (e.ctrlKey) e.preventDefault();
          if (searching) return stopSearch();
          if (chatting) return exitChat();
          return;
      }
    };

    window.addEventListener('keydown', keydownEvents);

    return () => {
      window.removeEventListener('keydown', keydownEvents);
    };
  }, [input, searching, roomId, chatting, chat]);

  const message = (chat: Chat, key: React.Key) => {
    if (chat.uid === 'system')
      return <Notification className="mb-2" text={chat.message} />;

    if (
      (chat.uid === uid && chat.message === 'cherm help') ||
      chat.message !== 'cherm help'
    )
      return (
        <>
          <Message className="mb-2" chat={chat} />
          {chat.message === 'cherm help' && chat.uid === uid && (
            <Help parentKey={key} />
          )}
        </>
      );

    return <></>;
  };

  return (
    <div
      className="flex-grow mt-4 p-4 border-solid border-[0.025rem] border-white rounded overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      <form onSubmit={parseInput}>
        <input
          ref={inputRef}
          disabled={searching}
          className="absolute inset-0 h-0"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            setCursor((cursor) => ({
              ...cursor,
              pos: e.target.selectionStart as number,
            }));
          }}
          onKeyUp={(e) => {
            setCursor((cursor) => ({
              ...cursor,
              pos: e.target.selectionStart as number,
            }));
          }}
        />
      </form>
      {uid && (
        <>
          {chat.map((chat, i) => {
            const key = chat.timestamp
              ? `chat-${chat.timestamp.toDate().toString()}`
              : `chat-${i}`;
            return (
              <React.Fragment key={key}>{message(chat, key)}</React.Fragment>
            );
          })}
          <Prompt cursor={cursor} searching={searching} />
          {searching && (
            <Notification
              className="mt-2"
              subClassName="three-dot-loader"
              text="searching for a stranger..."
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
