"use client";

import * as React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import type { AnswerData } from "@/lib/types";
import type { AnswerBlockRegion } from "@/lib/ai/schemas/answer-blocks-schema";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

function iconButtonClass(disabled: boolean): string {
  return disabled
    ? "cursor-not-allowed rounded-md p-1 text-white/30"
    : "cursor-pointer rounded-md p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white active:bg-white/20";
}

interface PdfViewerProps {
  answer: AnswerData | null;
  selectedQuestion: string | null;
  answerSheetUrl?: string;
  answerSheetMimeType?: string;
}

export function PdfViewer({
  answer,
  selectedQuestion,
  answerSheetUrl,
  answerSheetMimeType,
}: PdfViewerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const pageRefs = React.useRef(new Map<number, HTMLDivElement>());
  const [numPages, setNumPages] = React.useState(0);
  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dragging, setDragging] = React.useState(false);
  const drag = React.useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const isImage = !!answerSheetMimeType?.startsWith("image/");

  // Measure the scrollable viewport width so base (100%) page size fits it.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => setViewportWidth(el.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const zoomPercent = Math.round(zoom * 100);
  const basePageWidth = viewportWidth;
  const pageWidth = basePageWidth * zoom;
  // An image answer sheet is treated as a single page.
  const totalPages = isImage ? 1 : numPages;
  const displayPage = isImage ? 1 : currentPage;
  const prevDisabled = isImage ? true : currentPage <= 1;
  const nextDisabled = isImage ? true : currentPage >= numPages;
  const isOverflowing = basePageWidth > 0 && pageWidth > basePageWidth;
  const scrollCursorClass = dragging
    ? "cursor-grabbing"
    : isOverflowing
    ? "cursor-grab"
    : "";

  // Resolve selected question → blockIds → blocks → regions, grouped by page.
  const highlightsByPage = React.useMemo(() => {
    const byPage = new Map<number, AnswerBlockRegion[]>();
    if (!answer || !selectedQuestion) return byPage;

    const mapping = answer.mappings.find(
      (m) => m.questionNumber === selectedQuestion
    );
    if (!mapping) return byPage;

    for (const block of answer.blocks) {
      if (!mapping.blockIds.includes(block.id)) continue;
      for (const region of block.regions) {
        const list = byPage.get(region.page) ?? [];
        list.push(region);
        byPage.set(region.page, list);
      }
    }
    return byPage;
  }, [answer, selectedQuestion]);

  const scrollToPage = React.useCallback(
    (pageNumber: number, smooth = true) => {
      if (pageNumber < 1 || pageNumber > numPages) return;
      const el = pageRefs.current.get(pageNumber);
      const container = scrollRef.current;
      if (!el || !container) return;

      const pageRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      container.scrollTo({
        top: container.scrollTop + (pageRect.top - containerRect.top - 24),
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [numPages]
  );

  // Scroll the answer PDF to the first page that has a highlighted region.
  React.useEffect(() => {
    if (highlightsByPage.size === 0) return;
    const minPage = Math.min(...highlightsByPage.keys());
    scrollToPage(minPage);
  }, [highlightsByPage, scrollToPage, pageWidth]);

  const handlePrev = () => {
    if (prevDisabled) return;
    const next = currentPage - 1;
    setCurrentPage(next);
    scrollToPage(next);
  };

  const handleNext = () => {
    if (nextDisabled) return;
    const next = currentPage + 1;
    setCurrentPage(next);
    scrollToPage(next);
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(MIN_ZOOM, Number((z - ZOOM_STEP).toFixed(2))));
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(MAX_ZOOM, Number((z + ZOOM_STEP).toFixed(2))));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !scrollRef.current) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || !scrollRef.current) return;
    scrollRef.current.scrollLeft = d.scrollLeft - (e.clientX - d.startX);
    scrollRef.current.scrollTop = d.scrollTop - (e.clientY - d.startY);
  };

  const endDrag = () => {
    drag.current.active = false;
    setDragging(false);
  };

  return (
    <div className="flex h-full w-full min-h-0 flex-col">
      {/* Header */}
      <div
        className="flex w-full shrink-0 items-center justify-between px-2.5 py-2 h-[52px] lg:px-4 lg:py-2.5 lg:h-[56px]"
        style={{
          background: "#303030",
          borderBottom: "1.25px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className="text-[13px] font-bold leading-[140%] tracking-[-0.04em] lg:text-[14px]"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          Answer Sheet
        </h2>

        <div className="flex items-center gap-1.5 lg:gap-2">
          {/* Zoom Control */}
          <div
            className="flex items-center h-[30px] gap-1.5 px-[7px] py-[5px] lg:h-[32px] lg:gap-2 lg:px-2.5 lg:py-1.5"
            style={{
              borderRadius: "8px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className={iconButtonClass(zoom <= MIN_ZOOM)}
            >
              <Minus className="size-[14px] lg:size-[15px]" />
            </button>
            <span className="text-[11px] font-bold leading-none text-white lg:text-[12px]">
              {zoomPercent}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className={iconButtonClass(zoom >= MAX_ZOOM)}
            >
              <Plus className="size-[14px] lg:size-[15px]" />
            </button>
          </div>

          {/* Page Navigation */}
          <div
            className="flex items-center h-[30px] gap-1.5 px-[7px] py-[5px] lg:h-[32px] lg:gap-2 lg:px-2.5 lg:py-1.5"
            style={{
              borderRadius: "8px",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={prevDisabled}
              aria-label="Previous page"
              className={iconButtonClass(prevDisabled)}
            >
              <ChevronLeft className="size-[14px] lg:size-[15px]" />
            </button>
            <span className="whitespace-nowrap text-[11px] font-bold leading-none text-white lg:text-[12px]">
              Page {displayPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={nextDisabled}
              aria-label="Next page"
              className={iconButtonClass(nextDisabled)}
            >
              <ChevronRight className="size-[14px] lg:size-[15px]" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`min-h-0 flex-1 overflow-auto bg-[#4A4A4A] ${
          dragging ? "select-none" : ""
        } ${scrollCursorClass}`}
      >
        <div
          className="flex flex-col items-center p-6"
          style={{ width: "max-content", minWidth: "100%", minHeight: "100%" }}
        >
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={answerSheetUrl ?? ""}
              alt="Answer Sheet"
              draggable={false}
              style={{ width: pageWidth || undefined, height: "auto" }}
              className="shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            />
          ) : answerSheetUrl ? (
            <Document
              file={answerSheetUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from({ length: numPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <div
                    key={pageNumber}
                    ref={(el) => {
                      if (el) pageRefs.current.set(pageNumber, el);
                      else pageRefs.current.delete(pageNumber);
                    }}
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={pageWidth || undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="mx-auto mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                    >
                      {({ page }) => {
                        const regions = highlightsByPage.get(pageNumber) ?? [];
                        if (regions.length === 0 || !basePageWidth) return null;

                        const viewport = page.getViewport({ scale: 1 });
                        const scale = pageWidth / viewport.width;

                        return (
                          <>
                            {regions.map((r, i) => (
                              <div
                                key={i}
                                style={{
                                  position: "absolute",
                                  left: r.left * scale,
                                  top: r.top * scale,
                                  width: r.width * scale,
                                  height: r.height * scale,
                                  zIndex: 10,
                                }}
                                className="pointer-events-none rounded-sm border-2 border-green-500 bg-green-400/25"
                              />
                            ))}
                          </>
                        );
                      }}
                    </Page>
                  </div>
                );
              })}
            </Document>
          ) : (
            <div className="flex min-h-full w-full items-center justify-center p-8">
              <p className="text-sm text-white/60">No answer sheet available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
