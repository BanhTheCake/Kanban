import { Box, Button, ButtonGroup } from '@chakra-ui/react';
import { Editor } from '@tiptap/react';
import { FC } from 'react';
import { AiOutlineBold, AiOutlineItalic, AiOutlineStrikethrough, AiOutlineUnorderedList, AiOutlineOrderedList } from 'react-icons/ai'
import { IoMdCode } from 'react-icons/io'
import { BiParagraph } from 'react-icons/bi'
import { RiCodeBoxLine, RiDoubleQuotesL } from 'react-icons/ri'
import { GrUndo, GrRedo } from 'react-icons/gr'

interface MenuBarProps {
    editor: Editor | null;
}

const MenuBar: FC<MenuBarProps> = ({ editor }) => {
    if (!editor) return null;

    return (
        <>
            <Box w='full' border='2px' borderColor={'whiteAlpha.800'} roundedTop='sm' display={'flex'} alignItems='center' p={2}>
                <ButtonGroup pr={'2'} borderRight={'2px'} borderColor={'whiteAlpha.600'}>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('bold') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        variant={'unstyled'}
                    >
                        <AiOutlineBold size={22} />
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('italic') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        variant={'unstyled'}
                    >
                        <AiOutlineItalic size={22} />
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('strike') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={!editor.can().chain().focus().toggleStrike().run()}
                        variant={'unstyled'}
                    >
                        <AiOutlineStrikethrough size={22} />
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('code') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={!editor.can().chain().focus().toggleCode().run()}
                        variant={'unstyled'}
                    >
                        <IoMdCode size={22} />
                    </Button>
                </ButtonGroup>
                <ButtonGroup px={'2'} borderRight={'2px'} borderColor={'whiteAlpha.600'}>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('heading', { level: 1 }) ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        variant={'unstyled'}
                    >
                        H<small>1</small>
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('heading', { level: 2 }) ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        variant={'unstyled'}
                    >
                        H<small>2</small>
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('paragraph') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        variant={'unstyled'}
                    >
                        <BiParagraph size={22} />
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('bulletList') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        variant={'unstyled'}
                    >
                        <AiOutlineUnorderedList size={22} />
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('orderedList') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        variant={'unstyled'}
                    >
                        <AiOutlineOrderedList size={22} />
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('codeBlock') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        variant={'unstyled'}
                    >
                        <RiCodeBoxLine size={22} />
                    </Button>
                </ButtonGroup>
                <ButtonGroup px={'2'} borderColor={'whiteAlpha.600'}>
                    <Button
                        display={'flex'}
                        p={'1'}
                        bg={editor.isActive('blockquote') ? 'blackAlpha.700' : ''}
                        _hover={{ bg: 'black' }}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        variant={'unstyled'}
                    >
                        <RiDoubleQuotesL size={22} />
                    </Button>
                </ButtonGroup>
                <ButtonGroup px={'2'} borderColor={'whiteAlpha.600'} sx={{ flex: '1' }} ml='auto' justifyContent={'end'}>
                    <Button
                        display={'flex'}
                        p={'1'}
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                    >
                        <GrUndo size={22} />
                    </Button>
                    <Button
                        display={'flex'}
                        p={'1'}
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                    >
                        <GrRedo size={22} />
                    </Button>
                </ButtonGroup>
            </Box>
        </>
    );
};

export default MenuBar;
