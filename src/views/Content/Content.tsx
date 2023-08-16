import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Main from 'layouts/Main';
import Container from 'components/Container';

import { Block, DynamicPage } from 'types/dynamicPage';
import { getPageByPermalink } from 'services/contentApi';
import { HtmlBlock, ColumnBlock, ImageGalleryBlock, ImageBlock } from './components';
import Hero from './components/Hero';
import { Typography } from '@mui/material';

interface Props {
    pageName: string;
}

const Content = ({ pageName }: Props): JSX.Element => {
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activePage, setActivePage] = useState<DynamicPage | null>(null);

    const router = useRouter();

    const getContent = async () => {
        setIsLoading(true);
        try {
            const pc = await getPageByPermalink(pageName, 'MainSite');
            console.log('pc', pc);
            if (pc == null) {
                router.push('/not-found');
            } else {
                setActivePage(pc);
            }
        } catch (error) {
            console.log(error);
            router.push('/not-found');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pageName) {
            getContent();
        }
    }, [pageName]);

    useEffect(() => {
        if (activePage) {
            console.log('pageContent', activePage);
        }
    }, [activePage]);

    const renderBlock = (block: Block, index: number) => {
        switch (block.type) {
            case 'Piranha.Extend.Blocks.HtmlBlock':
                return <HtmlBlock block={block} />;
            case 'Piranha.Extend.Blocks.ColumnBlock':
                return <ColumnBlock block={block} />;
            case 'Piranha.Extend.Blocks.ImageGalleryBlock':
                return <ImageGalleryBlock block={block} />;
            case 'Piranha.Extend.Blocks.ImageBlock':
                return <ImageBlock block={block} />;
            default:
                return (
                    <Fragment>
                        <div>No block renderer for block type {block.type}</div>
                    </Fragment>
                );
        }
    };

    const renderBlockContent = () => {
        if (activePage && activePage.blocks) {
            return (
                <Box>
                    {activePage.blocks.map((block: Block, index: number) => {
                        return (
                            <Typography component={'p'} key={index}>
                                {renderBlock(block, index)}
                            </Typography>
                        );
                    })}
                </Box>
            );
        }
        return <Fragment />;
    };

    return (
        <Main colorInvert={true}>
            <Hero page={activePage} />
            <Container>{renderBlockContent()}</Container>
        </Main>
    );
};

export default Content;
