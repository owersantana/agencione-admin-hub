
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Link, Image, List, ListOrdered, Eye, Edit } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DescriptionEditor({ value, onChange, placeholder }: DescriptionEditorProps) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }
    }, 0);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        insertText(`![Imagem](${imageData})`);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageUrl = () => {
    if (imageUrl.trim()) {
      insertText(`![Imagem](${imageUrl.trim()})`);
      setImageUrl('');
      setShowImageUpload(false);
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**'), title: 'Negrito' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Itálico' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: List, action: () => insertText('- '), title: 'Lista' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Lista numerada' },
  ];

  return (
    <div className="space-y-2">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-2 border rounded-t-md bg-muted/50">
            {viewMode === 'edit' && toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={button.action}
                title={button.title}
              >
                <button.icon className="h-3 w-3" />
              </Button>
            ))}
            
            {viewMode === 'edit' && (
              <Popover open={showImageUpload} onOpenChange={setShowImageUpload}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    title="Inserir imagem"
                  >
                    <Image className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-file">Upload de arquivo</Label>
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                      />
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">ou</div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image-url">URL da imagem</Label>
                      <div className="flex gap-2">
                        <Input
                          id="image-url"
                          placeholder="https://exemplo.com/imagem.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button onClick={insertImageUrl} size="sm">
                          Inserir
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit className="h-3 w-3" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Visualizar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px] rounded-t-none border-t-0 resize-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[120px] p-3 border rounded-b-md bg-background">
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-muted-foreground text-sm">Nada para visualizar</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
