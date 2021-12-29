import * as Monaco from 'monaco-editor';

namespace MonacoInternals {
    /**
    * In order to look at the undo/redo stack, we need to expose some internal
    * parts of ITextModel.
    *
    * This is potentially brittle, but it is probably a fairly robust way of
    * getting the state. To add robustness, mark all these as potentially
    * undefined, so callers have to check existence first.
    */
    export interface ITextModelInternal {
        readonly _commandManager: Partial<ICommandManager>;
    }
    
    /**
    * We don't care about the ICommandManager, other than that it has an undoRedoService.
    */
    interface ICommandManager {
        /**
        * We only care whether or not we can undo or redo.
        * 
        * https://github.com/microsoft/vscode/blob/49efe65bc3769cff56182bfd5ce881fa4654ca6a/src/vs/platform/undoRedo/common/undoRedo.ts#L113
        */
        readonly _undoRedoService: Partial<{
            /**
            * Can you undo?
            * @param resource model URI
            */
            canUndo(resource: unknown /* Monaco.Uri | UndoRedoSource */): boolean;
            
            /**
            * Can you redo?
            * @param resource model URI
            */
            canRedo(resource: unknown /* Monaco.Uri | UndoRedoSource */): boolean;
        }>
    }
}

export default class UndoRedoHelper {
    private readonly _editor: Monaco.editor.IStandaloneCodeEditor;
    
    constructor(editor: Monaco.editor.IStandaloneCodeEditor) {
        this._editor = editor;
    }
    
    public canUndo(): boolean {
        const model = this._editor.getModel();
        if (!model) {
            return false;
        }
        const internalModel = (model as unknown as MonacoInternals.ITextModelInternal);
        return internalModel._commandManager?._undoRedoService?.canUndo?.(model.uri) ?? false;
    }

    public canRedo(): boolean {
        const model = this._editor.getModel();
        if (!model) {
            return false;
        }
        const internalModel = (model as unknown as MonacoInternals.ITextModelInternal);
        return internalModel._commandManager?._undoRedoService?.canRedo?.(model.uri) ?? false;
    }

    public undo(): void {
        // https://github.com/microsoft/monaco-editor/issues/451
        this._editor.trigger("p5_button", "undo", null);
    }

    public redo(): void {
        this._editor.trigger("p5_button", "redo", null);
    }
}