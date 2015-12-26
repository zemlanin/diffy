import {map, reject, get, assign} from 'lodash';
import {Observable} from 'rx';

const EVENTS = {
    onDrop: "onDrop",
    onDragOver: "onDragOver",
    onDragLeave: "onDragLeave",
    onFileRead: "onFileRead",
    onFileRemoveClick: "onFileRemoveClick",
    onEnterPath: "onEnterPath",
};

function wrap(h) {
    return (msg, state) => {
        let [newState, effect] = h(msg, state.state);

        state.state = newState;

        return [state, effect];
    };
}

function read(files) {
    return (state, stream) => (
        Observable.merge.apply(Observable, map(files, (file) => {
            const reader = new FileReader();
            reader.readAsText(file.slice());

            return Observable.fromEvent(reader, 'loadend')
                .map(() => reader.result)
                .map(JSON.parse)
                .onErrorResumeNext(Observable.return({error: 'parse error'}))
                .do((data) => stream.send(
                    EVENTS.onFileRead,
                    {name: file.name, data}
                ));
        }))
    );
}

function onDrop({payload}, state) {
    payload.event.stopPropagation();
    payload.event.preventDefault();

    state.draggedOver = false;

    return [state, read(payload.event.dataTransfer.files)];
}

function onDragOver({payload}, state) {
    payload.event.stopPropagation();
    payload.event.preventDefault();

    if (!state.draggedOver) {
        state.draggedOver = true;
    }

    return [state];
}

function onDragLeave({payload}, state) {
    payload.event.stopPropagation();
    payload.event.preventDefault();

    if (state.draggedOver) {
        state.draggedOver = false;
    }

    return [state];
}

function onFileRead({payload}, state) {
    state.files = reject(state.files, 'name', payload.name).concat(payload);

    return [state];
}

function onFileClick({payload}, state) {
    state.activeFile = payload.data.name;

    return [state];
}

function onFileRemoveClick({payload}, state) {
    state.files = reject(
        state.files,
        ({name}) => name == payload.data.name
    );

    return [state];
}

function onEnterPath({payload: {data: {path}}}, state) {
    state.hoveredPath = path;

    return [state];
}

const update = [
    [EVENTS.onDrop, wrap(onDrop)],
    [EVENTS.onDragOver, wrap(onDragOver)],
    [EVENTS.onDragLeave, wrap(onDragLeave)],
    [EVENTS.onFileRead, wrap(onFileRead)],
    [EVENTS.onFileClick, wrap(onFileClick)],
    [EVENTS.onFileRemoveClick, wrap(onFileRemoveClick)],
    [EVENTS.onEnterPath, wrap(onEnterPath)],
];

export {
    EVENTS,
    update,
};
