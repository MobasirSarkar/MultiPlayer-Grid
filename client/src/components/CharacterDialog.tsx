import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { Input } from "./ui/input";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";

interface CharacterInputDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (character: string) => void;
    selectedCell: { x: number; y: number } | null;
    disabled: boolean;
}

// i know it should be a seperate file but i am too lazy.
const formSchema = z.object({
    character: z.string().min(1, { message: "Please enter at least one character" }).max(3, { message: "maximum 3 characters allowed" })
})
type FormValues = z.infer<typeof formSchema>

export const CharacterInputDialog: React.FC<CharacterInputDialogProps> = ({ isOpen, onClose, onSubmit, disabled, selectedCell }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            character: '',
        }
    })

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen])

    const handleSubmit = (values: FormValues) => {
        onSubmit(values.character);
        form.reset();
        onClose();
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gray-100">
                <DialogHeader>
                    <DialogTitle>Enter Character</DialogTitle>
                    <DialogDescription>
                        {selectedCell && (
                            <span>
                                Enter a character or emoji for cell ({selectedCell.x}, {selectedCell.y})
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-3">
                    <FieldGroup>
                        <Controller
                            name="character"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-valid={fieldState.invalid}>
                                    <FieldLabel htmlFor="character">
                                        Character
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="character"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Type a character or emoji..."
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        You can enter up to 3 characters (including emojis)
                                    </FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={disabled || !form.formState.isValid}
                            className="flex-1"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
