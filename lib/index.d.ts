/// <reference types="react" />
import { AnyAction } from 'redux';
declare type Action1<P> = {
    type: '@redux-buffer-state/INIT_BUFFER_STATE' | '@redux-buffer-state/UPDATE_BUFFER_STATE';
    payload: {
        name: string;
        newState: P;
    };
};
declare type Action<P> = AnyAction | Action1<P>;
export declare const ReduxDispatchProvider: (props: {
    children: any;
}) => JSX.Element;
export default function useBufferState<S>({ name, initialState, bufferMs, syncOnInit, }: {
    name: string;
    initialState: S;
    bufferMs: number;
    syncOnInit: boolean;
}): (S | ((newState: S) => void))[];
export declare function debugReducer<S>(state: {} | undefined, action: Action<S>): {};
export declare function createPartialReducer<S>(targetName: string, initialState: S): (state: {} | undefined, action: Action<S>) => any;
export {};
