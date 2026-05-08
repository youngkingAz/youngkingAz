// @ts-nocheck
"use client";

import * as React from 'react';

import { cn } from '../../lib/utils';

const THEMES = {
  light: '',
  dark: '.dark',
};

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

const ChartContainer = React.forwardRef(({ id, className, children, config = {}, style, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(className)}
        style={{
          display: 'flex',
          aspectRatio: '16 / 9',
          justifyContent: 'center',
          alignItems: 'stretch',
          width: '100%',
          fontSize: '0.75rem',
          color: '#f5f5f5',
          background: '#0b0b0b',
          border: '1px solid #262626',
          borderRadius: '0.9rem',
          padding: '0.75rem',
          ...style,
        }}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'Chart';

const ChartStyle = ({ id, config = {} }) => {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig?.theme || itemConfig?.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart="${id}"] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = ({ active, content, payload, label }) => {
  if (!active) {
    return null;
  }

  if (typeof content === 'function') {
    return content({ active, payload, label });
  }

  return content || null;
};

const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      style,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value = !labelKey && typeof label === 'string' ? config[label]?.label || label : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn(labelClassName)} style={{ fontWeight: 600 }}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return (
        <div className={cn(labelClassName)} style={{ fontWeight: 600 }}>
          {value}
        </div>
      );
    }, [config, hideLabel, label, labelClassName, labelFormatter, labelKey, payload]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: 'grid',
          minWidth: '8rem',
          gap: '0.5rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255,255,255,0.1)',
          background: '#111111',
          padding: '0.75rem',
          fontSize: '0.75rem',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.3)',
          ...style,
        }}
      >
        {!nestLabel ? tooltipLabel : null}
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload?.fill || item.color || '#f97316';

            return (
              <div
                key={`${item.dataKey || item.name || 'value'}-${index}`}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: indicator === 'dot' ? 'center' : 'stretch',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : !hideIndicator ? (
                      <div
                        style={{
                          flexShrink: 0,
                          width: indicator === 'line' ? '0.25rem' : indicator === 'dashed' ? 0 : '0.625rem',
                          height: indicator === 'dot' ? '0.625rem' : '1rem',
                          borderRadius: indicator === 'dot' ? '999px' : '2px',
                          border:
                            indicator === 'dashed'
                              ? `1.5px dashed ${indicatorColor}`
                              : `1px solid ${indicatorColor}`,
                          background: indicator === 'dashed' ? 'transparent' : indicatorColor,
                          marginTop: nestLabel && indicator === 'dashed' ? '0.25rem' : 0,
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: nestLabel ? 'flex-end' : 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'grid', gap: '0.35rem' }}>
                        {nestLabel ? tooltipLabel : null}
                        <span style={{ color: '#a3a3a3' }}>{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value !== undefined && item.value !== null ? (
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#f5f5f5' }}>
                          {Number(item.value).toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltip';

const ChartLegend = ({ content, payload, verticalAlign = 'bottom' }) => {
  if (typeof content === 'function') {
    return content({ payload, verticalAlign });
  }

  return content || null;
};

const ChartLegendContent = React.forwardRef(
  ({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey, style }, ref) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          paddingTop: verticalAlign === 'top' ? 0 : '0.75rem',
          paddingBottom: verticalAlign === 'top' ? '0.75rem' : 0,
          flexWrap: 'wrap',
          ...style,
        }}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value || key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#d4d4d4',
              }}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    flexShrink: 0,
                    borderRadius: '2px',
                    backgroundColor: item.color || '#f97316',
                  }}
                />
              )}
              {itemConfig?.label || item.value}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = 'ChartLegend';

function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey = key;

  if (key in payload && typeof payload[key] === 'string') {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === 'string') {
    configLabelKey = payloadPayload[key];
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};


