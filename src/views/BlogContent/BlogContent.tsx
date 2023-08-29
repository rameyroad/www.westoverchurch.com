import React, { Fragment, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

import { Box, Typography } from '@mui/material';

import Main from 'layouts/Main';
import Container from 'components/Container';

import { Block, DynamicPost } from 'types/dynamicPage';
import { getBlogPostBySlug } from 'services/contentApi';
import { ColumnBlock, HtmlBlock, ImageBlock, ImageGalleryBlock } from 'views/Content/components';
import { Hero } from './components/Hero';

interface Props {
    postName: string;
}

const Content = ({ postName }: Props): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [acivePost, setActivePost] = useState<DynamicPost | null>(null);

    const getContent = async () => {
        setIsLoading(true);
        try {
            const pc = await getBlogPostBySlug(postName);
            if (pc == null) {
                notFound();
            } else {
                setActivePost(pc);
            }
        } catch (error) {
            console.log(error);
            notFound();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (postName) {
            getContent();
        }
    }, [postName]);

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
        if (acivePost && acivePost.blocks) {
            return (
                <Box>
                    {acivePost.blocks.map((block: Block, index: number) => {
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
        <Main>
            <Hero post={acivePost} />
            <Container>{renderBlockContent()}</Container>
        </Main>
    );
};

export default Content;
