import { useEffect, useRef } from "react";

import NProgress from 'nprogress';
import Router from "next/router";

interface Props {
    color?: string;
    height?: number;
    startPosition?: number;
    stopDelayMs?: number;
    options?: {};
}

export default function Progressbar({ color = "var(--primary-02)", height = 0.3, startPosition = 3, stopDelayMs = 200, options = { showSpinner: false } }: Props) {
    const timer = useRef<any>(null);

    const routeChangeStart = () => {
        NProgress.set(startPosition);
        NProgress.start();
    };

    const routeChangeEnd = () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            NProgress.done(true);
        }, stopDelayMs);
    };

    useEffect(() => {
        if (options) {
            NProgress.configure(options);
        }

        Router.events.on('routeChangeStart', routeChangeStart);
        Router.events.on('routeChangeComplete', routeChangeEnd);
        Router.events.on('routeChangeError', routeChangeEnd);
    }, [])

    return (
        <style jsx global>{`
          #nprogress {
            pointer-events: none;
          }
          #nprogress .bar {
            background: ${color};
            position: fixed;
            z-index: 1031;
            top: 0;
            left: 0;
            width: 100%;
            height: ${height}rem;
          }
          #nprogress .peg {
            display: block;
            position: absolute;
            right: 0px;
            width: 100px;
            height: 100%;
            box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
            opacity: 1;
            -webkit-transform: rotate(3deg) translate(0px, -4px);
            -ms-transform: rotate(3deg) translate(0px, -4px);
            transform: rotate(3deg) translate(0px, -4px);
          }
          #nprogress .spinner {
            /* display: "block";
            position: fixed;
            z-index: 1031;
            top: 15px;
            right: 15px; */
            display: none;
          }
          #nprogress .spinner-icon {
            width: 18px;
            height: 18px;
            box-sizing: border-box;
            border: solid 2px transparent;
            border-top-color: ${color};
            border-left-color: ${color};
            border-radius: 50%;
            -webkit-animation: nprogresss-spinner 400ms linear infinite;
            animation: nprogress-spinner 400ms linear infinite;
          }
          .nprogress-custom-parent {
            overflow: hidden;
            position: relative;
          }
          .nprogress-custom-parent #nprogress .spinner,
          .nprogress-custom-parent #nprogress .bar {
            position: absolute;
          }
          @-webkit-keyframes nprogress-spinner {
            0% {
              -webkit-transform: rotate(0deg);
            }
            100% {
              -webkit-transform: rotate(360deg);
            }
          }
          @keyframes nprogress-spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>);
}