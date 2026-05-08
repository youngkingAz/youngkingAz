import React, { useState } from 'react';

import { Button } from '../ui/button';

/**
 * @typedef {object} ExerciseLike
 * @property {string} [name]
 * @property {number} [sets]
 * @property {string | number} [reps]
 * @property {number} [rest_seconds]
 * @property {string} [notes]
 * @property {string} [video_url]
 */

/**
 * @param {{ exercise?: ExerciseLike, index?: number }} props
 */
export default function ExerciseCard({ exercise = {}, index = 0 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #2a2a2a',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        color: '#f5f5f5',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '999px',
            background: 'rgba(249, 115, 22, 0.12)',
            color: '#f97316',
            fontSize: '1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {index + 1}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#f5f5f5',
            }}
          >
            {exercise.name || 'Exercise'}
          </h4>

          <p
            style={{
              margin: '0.35rem 0 0',
              fontSize: '0.75rem',
              color: '#a3a3a3',
            }}
          >
            {exercise.sets || 0} sets x {exercise.reps || '-'}
            {exercise.rest_seconds ? <span> | Rest {exercise.rest_seconds}s</span> : null}
          </p>
        </div>

        <span
          aria-hidden="true"
          style={{
            fontSize: '0.9rem',
            color: '#a3a3a3',
          }}
        >
          {expanded ? '^' : 'v'}
        </span>
      </button>

      {expanded ? (
        <div
          style={{
            borderTop: '1px solid #2a2a2a',
            padding: '0 1rem 1rem',
          }}
        >
          {exercise.notes ? (
            <p
              style={{
                margin: '0.75rem 0 0',
                fontSize: '0.9rem',
                color: '#a3a3a3',
                lineHeight: 1.6,
              }}
            >
              {exercise.notes}
            </p>
          ) : null}

          {exercise.video_url ? (
            <a
              href={exercise.video_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: '0.75rem', textDecoration: 'none' }}
            >
              <Button
                size="sm"
                variant="outline"
                style={{
                  color: '#f97316',
                  borderColor: 'rgba(249, 115, 22, 0.3)',
                  fontSize: '0.75rem',
                }}
              >
                <span aria-hidden="true">{'>'}</span>
                Watch Demo
              </Button>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
