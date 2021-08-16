import styled from 'styled-components';

export const StyledIconWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

export const StyledContainer = styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
    margin: 0 0 16px;
    border: 1px solid #ebedf0;
    border-radius: 2px;
    transition: all 0.2s;

    .text-divider {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &::before,
        &::after {
            border-top: 1px solid #e8e8e8;
            content: '';
        }

		&::before {
			width: 5%;
		}

		&::after {
			width: 95%;
		}

        & > span {
            display: inline-block;
            padding: 0 10px;
            font-weight: 500;
            font-size: 16px;
            font-variant: tabular-nums;
            line-height: 1.5;
            white-space: nowrap;
            text-align: center;
        }
    }

    .divider {
        position: relative;
        top: -0.06em;
        display: block;
        clear: both;
        box-sizing: border-box;
        width: 100%;
        min-width: 100%;
        height: 1px;
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5;
        list-style: none;
        background: none;
        border: dashed #e8e8e8;
        border-width: 1px 0 0;
        font-feature-settings: 'tnum';
    }

    .code-box-demo {
        padding: 42px 24px 50px;
        transition: all 0.2s;
    }

    .code-box-meta {
        font-size: 14px;
        line-height: 2;
    }

    .code-box .ant-divider {
        margin: 0;
    }

    .code-box-description {
        padding: 18px 24px 12px;
    }

    .code-box-action {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-size: 16px;
    }

    .code-box-action .anticon {
        margin: 0 8px;
        cursor: pointer;
    }

    .container_editor_area {
        padding: 16px;
        border-top: 1px solid rgb(232, 232, 232);
    }

    .container__editor {
        border-radius: 3px;
        font-variant-ligatures: common-ligatures;
    }

    .container__editor textarea {
        background-color: none;
        outline: 0;
    }

    .button {
        display: inline-block;
        padding: 0 6px;
        color: #fff;
        text-decoration: none;
        background: #000;
    }

    .button:hover {
        background: linear-gradient(45deg, #e42b66, #e2433f);
    }

    /* Syntax highlighting */
    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
        color: #90a4ae;
    }
    .token.punctuation {
        color: #9e9e9e;
    }
    .namespace {
        opacity: 0.7;
    }
    .token.property,
    .token.tag,
    .token.boolean,
    .token.number,
    .token.constant,
    .token.symbol,
    .token.deleted {
        color: #e91e63;
    }
    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
        color: #4caf50;
    }
    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string {
        color: #795548;
    }
    .token.atrule,
    .token.attr-value,
    .token.keyword {
        color: #3f51b5;
    }
    .token.function {
        color: #f44336;
    }
    .token.regex,
    .token.important,
    .token.variable {
        color: #ff9800;
    }
    .token.important,
    .token.bold {
        font-weight: bold;
    }
    .token.italic {
        font-style: italic;
    }
    .token.entity {
        cursor: help;
    }
`;
