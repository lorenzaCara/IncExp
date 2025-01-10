import { Fragment, useId, useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import ListItem from './ListItem'
import { Input } from './ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { EllipsisVertical, Pen, Trash2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



const List = ({ list, onDelete, onUpdate }) => {

    const items = Array.from(
            new Array(10)
        ).map((item, index) => { //math random tira fuori un numero random da 0 a 1 ==>  Math.floor(Math.random() * 10)
        return { id: useId(), label: 'item ' + index, checked: index % 2 === 0} 
    })

    const [todos, setTodos] = useState(items); /* metodo che accetta il paramentro con cui inizia. Si realizza con la tecnica del destructuring. */
    const [todoLabel, setTodoLabel] = useState("");
    const [alertOpen, setAlertOpen] = useState(false); /* setto a false, perchè di default è chiuso */
    const [dropdownOpen, setDropdownOpen] = useState(false);

    /* Se voglio checkare le checkbox al click. */
    const onCheck = (id, value) => { /* value è l'evento, ovvero stabilisce il true o false */
        setTodos(todos.map(todo => {
            if (todo.id == id) {
                return {id:todo.id, label:todo.label, checked: value}
            } else {
                return todo;
            }
        }));
    }

    const removeTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id)); /* Filtra l'array todos mantenendo solo gli elementi il cui id è diverso da quello che vuoi eliminare. Questo produce una nuova copia dell'array senza modificare l'originale.*/
    }

    const updateItem = (item) => { /* gli passo l'item che voglio modificare */
        setTodos(todos.map(todo => todo.id === item.id ? item : todo)); /* modifico solo l'item singolo e ritorno gli stessi items non modificati */
    }
    
    return (
        <>
            <Card className="break-inside-avoid mb-4">
                <CardHeader className='flex flex-row justify-between'>
                    <div>
                        <CardTitle>{list.title}</CardTitle>
                        <CardDescription>{list.description}</CardDescription>
                    </div>
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger>
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Menù</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect = {() => {
                                    setDropdownOpen(false);
                                    onUpdate(list);
                                }}
                            >
                                <Pen />
                                Modifica
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onSelect ={() =>{
                                    setDropdownOpen(false);
                                    setAlertOpen(true)
                                }}
                                className='text-destructive' 
                            >
                                <Trash2 />
                                Elimina
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
    
                </CardHeader>
                <CardContent className="gap-4 flex flex-col">
                    <form onSubmit={e => {
                        e.preventDefault();
                        //percorso per vedere in console.log il valore che inserisco dentro all'input
                        setTodos([{id:todoLabel, label:todoLabel, checked:false}, ...todos, ]); //creo un nuovo array che prende i contnuti di todos ma non lo modifico direttamente e ci aggiungo i nuovi elementi. Creo una copia dell'array esistente.
                        setTodoLabel("");
                        }}> {/* quando ho un solo parametro posso omettere le tonde */}
                        <Input name="todoLabel" value={todoLabel} onChange={(e) => setTodoLabel(e.target.value)}/> 
                    </form> 
                    {todos.filter(item => !item.checked).map(item => (
                        //componente Fragment è la versione esplicitata di <></> e ci da la possibilità di usare la key senza aggiungere un div genitore. VA IMPORTATO DA REACT. Utile per tornare più elementi html in uno
                        <ListItem 
                            key={item.id} 
                            item={item} 
                            onCheck={onCheck} 
                            removeTodo={removeTodo}
                            onItemChange={updateItem}
                            
                            />
                    ))}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger>Completati</AccordionTrigger>
                            <AccordionContent className="gap-4 flex flex-col">
                            {todos.filter(item => item.checked).map(item => (
                                <Fragment key={item.id}>
                                    <ListItem 
                                        item = {item} 
                                        onCheck = {onCheck} 
                                        removeTodo = {removeTodo} 
                                        onItemChange={updateItem}
                                    />
                                </Fragment>
                            ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Questa azione è irriversibile e cancellerà definitivamente la lista e tutti i suoi items.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(list)}>Continue</AlertDialogAction> {/* qui non gestisco l'eliminazione della lista, ma lo faccio dove ho lo stato delle liste, quindi su dashboard */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default List