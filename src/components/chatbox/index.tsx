import React, { Fragment, useRef, useEffect, useState } from 'react';
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
  const initial = useStore((state) => state.initial);
  const start = useStore((state) => state.start);
  const uid = useStore((state) => state.uid);
  const input = useStore((state) => state.input);
  const chat = useStore((state) => state.chat);
  const roomId = useStore((state) => state.roomId);
  const setChat = useStore((state) => state.setChat);
  const clearInput = useStore((state) => state.clearInput);
  const addInput = useStore((state) => state.addInput);
  const addChar = useStore((state) => state.addChar);
  const deleteChar = useStore((state) => state.deleteChar);
  const setRoomId = useStore((state) => state.setRoomId);
  const unsubRoomRef = useRef<Unsubscribe>();
  const unsubRoomChatRef = useRef<Unsubscribe>();
  const [chatting, setChatting] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [cursor, setCursor] = useState<boolean>(true);

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
      setCursor(true);

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
          setCursor(true);

          return;
        }
      });

      await addDoc(collection(roomsRef, uid, 'chat'), {
        uid: 'system',
        message: notification.chatting,
        timestamp: serverTimestamp(),
      });
    };

    setSearching(true);
    setCursor(false);

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
    setCursor(true);
  };

  const exitChat = async () => {
    const roomsRef = collection(db, 'rooms');

    await updateDoc(doc(roomsRef, roomId), {
      active: false,
    });

    setChat([...chat, { uid: 'system', message: notification.disconnect.me }]);

    setChatting(false);
  };

  const sendChat = async () =>
    await addDoc(collection(collection(db, 'rooms'), roomId, 'chat'), {
      uid: uid,
      message: input,
      timestamp: serverTimestamp(),
    });

  const parseInput = (input: string) => {
    if (!chatting && input === command.search) return search();

    if (chatting) {
      sendChat();
    } else {
      addInput();
    }
    clearInput();
  };

  useEffect(() => {
    if (chatting && initial) start();

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
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        if (searching) return stopSearch();
        if (chatting) return exitChat();
      }

      const c = e.key;

      switch (c) {
        case 'Enter':
          parseInput(input);
          break;
        case 'Backspace':
          deleteChar();
          break;
        case ' ':
          addChar(' ');
          break;
        default:
          if (c.length === 1) {
            addChar(e.key);
          }
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
    <div className="flex-grow p-4 mt-4 border-solid border-[0.025rem] border-white rounded">
      {initial && <Notification className="mb-2" text={notification.initial} />}
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
          <Prompt cursor={cursor} />
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
