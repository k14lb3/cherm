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
import useStore, { Chat } from '@/store';
import { command } from '@/utils/constants';
import { db } from '@/firebase';
import Prompt from '@/components/prompt';

const ChatBox: React.FC = () => {
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
  const [active, setActive] = useState<boolean>(false);
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
      });

      unsubRoomChatRef.current = onSnapshot(
        query(collection(roomsRef, roomId, 'chat'), orderBy('timestamp')),
        async (snapshot) =>
          setChat(snapshot.docs.map((doc) => doc.data() as Chat)),
      );

      setSearching(false);
      setActive(true);
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

        if (!room!.available) {
          unsubRoomChatRef.current = onSnapshot(
            query(collection(roomsRef, uid, 'chat'), orderBy('timestamp')),
            async (snapshot) =>
              setChat(snapshot.docs.map((doc) => doc.data() as Chat)),
          );

          setSearching(false);
          setActive(true);
          clearInput();
          setCursor(true);
        }
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

  const cancelSearch = async () => {
    const roomsRef = collection(db, 'rooms');

    unsubRoomRef.current && unsubRoomRef.current();
    unsubRoomChatRef.current && unsubRoomChatRef.current();

    await deleteDoc(doc(roomsRef, roomId));

    setSearching(false);
    clearInput();
    setCursor(true);
  };

  const sendChat = async (input: string) => {
    const roomsRef = collection(db, 'rooms');

    await addDoc(collection(roomsRef, roomId, 'chat'), {
      uid: uid,
      message: input,
      timestamp: serverTimestamp(),
    });
  };

  const parseInput = (input: string) => {
    if (input === command.search) return search();

    if (active) {
      sendChat(input);
    } else {
      addInput();
    }
    clearInput();
  };

  useEffect(() => {
    const keydownEvents = (e: KeyboardEvent) => {
      if (searching && e.ctrlKey && e.key.toLowerCase() === 'c')
        return cancelSearch();

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
  }, [input, searching, roomId]);

  return (
    <div className="flex-grow p-4 mt-4 border-solid border-[0.025rem] border-white rounded">
      {uid && (
        <>
          {active && (
            <div className="mb-2">
              <p className="text-gray">
                you are now chatting with a random stranger.
              </p>
            </div>
          )}
          {chat.map((chat) => (
            <div className="mb-2">
              <p className="break-all">
                <span className="font-bold">
                  {active
                    ? chat.uid === uid
                      ? 'you : '
                      : 'stranger : '
                    : '[me@cherm] → '}
                </span>
                {chat.message}
              </p>
            </div>
          ))}
          <Prompt cursor={cursor} />
          {searching && (
            <p className="three-dot-loader mt-2 text-gray">
              searching for a stranger...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
