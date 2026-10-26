import type { MenuItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Props = {
    menu: MenuItem[];
    onSelect: (item: MenuItem) => void;
};

export function MenuGrid({ menu, onSelect }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menu.map(item => (
                <Card key={item.id} className={!item.isAvailable ? 'opacity-50 overflow-hidden' : 'overflow-hidden hover:shadow-md transition-shadow'}>
                    {item.image && (
                        <div className="w-full h-32 overflow-hidden bg-muted">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <CardContent className="p-0">
                        <Button
                            disabled={!item.isAvailable}
                            onClick={() => onSelect(item)}
                            variant="ghost"
                            className={`h-auto w-full justify-start p-4 text-left whitespace-normal rounded-none ${
                                item.isAvailable ? 'cursor-pointer hover:bg-muted/50' : 'cursor-not-allowed'
                            }`}
                        >
                            <div className="flex flex-col gap-1 w-full">
                                <div className="font-semibold text-base leading-tight line-clamp-2">{item.name}</div>
                                <div className="text-muted-foreground text-sm font-medium mt-1">
                                    {item.price.toLocaleString('en-IN')} ₹
                                </div>
                                {!item.isAvailable && (
                                    <div className="mt-2">
                                        <Badge variant="destructive">
                                            Sold out
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}